import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, timeout } from 'rxjs';
import { TerrariaWeaponInfo } from './terraria-weapon-info';

@Injectable({
  providedIn: 'root',
})
export class WeaponsService {
  private readonly apiUrl = 'http://localhost:8080/api/weapons';
  private readonly requestTimeoutMs = 10000;

  private readonly weapons$: Observable<TerrariaWeaponInfo[]> = this.http.get<unknown>(this.apiUrl).pipe(
    timeout(this.requestTimeoutMs),
    map((payload) => this.normalizeWeapons(payload)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private currentFilter = '';

  constructor(private http: HttpClient) {}

  getAllWeapons(): Observable<TerrariaWeaponInfo[]> {
    return this.weapons$;
  }

  getWeaponById(id: number): Observable<TerrariaWeaponInfo | undefined> {
    return this.weapons$.pipe(map((list) => list.find((weapon) => weapon.id === id)));
  }

  setCurrentFilter(value: string): void {
    this.currentFilter = value;
  }

  getCurrentFilter(): string {
    return this.currentFilter;
  }

  private normalizeWeapons(payload: unknown): TerrariaWeaponInfo[] {
    if (Array.isArray(payload)) {
      return payload.map((item) => this.normalizeWeapon(item));
    }

    if (payload && typeof payload === 'object') {
      const embedded = (payload as Record<string, unknown>)['_embedded'];
      if (embedded && typeof embedded === 'object') {
        const weapons = (embedded as Record<string, unknown>)['weapons'];
        if (Array.isArray(weapons)) {
          return weapons.map((item) => this.normalizeWeapon(item));
        }
      }
    }

    return [];
  }

  private normalizeWeapon(payload: unknown): TerrariaWeaponInfo {
    const raw = (payload ?? {}) as Record<string, unknown>;
    const rawType = raw['type'];
    const rawSubType = raw['subType'];

    const idValue = Number(raw['id']);

    return {
      id: Number.isFinite(idValue) ? idValue : 0,
      name: this.asString(raw['name']) || this.asString(raw['nombre']),
      image: this.asString(raw['image']) || this.asString(raw['imagen']),
      category:
        this.asString(raw['category']) ||
        this.asString(raw['categoria']) ||
        this.asString(rawType),
      mode: this.asString(raw['mode']) || this.asString(raw['modo']),
      subtype: this.asString(raw['subtype']) || this.asString(rawSubType),
    };
  }

  private asString(value: unknown): string {
    if (!value) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      const nested = value as Record<string, unknown>;
      const directName = nested['name'];
      const spanishName = nested['nombre'];
      if (typeof directName === 'string') {
        return directName;
      }
      if (typeof spanishName === 'string') {
        return spanishName;
      }
    }

    return '';
  }
}
