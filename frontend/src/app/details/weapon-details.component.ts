import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import {WeaponsService} from '../weapons.service';
import {TerrariaWeaponInfo} from '../terraria-weapon-info';

@Component({
  selector: 'app-weapon-details',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (weapon$ | async; as weapon) {
      <article>
        <section class="listing-description">
          <h2 class="listing-heading">{{ weapon.name }}</h2>
          <h3 class="section-heading">Weapon details</h3>
          <p class="listing-location"><span class="info-label">Tipo:</span> {{ weapon.category || 'N/A' }}</p>
          <p class="listing-location"><span class="info-label">Modo:</span> {{ weapon.mode || 'N/A' }}</p>
          <p class="listing-location"><span class="info-label">Subtype:</span> {{ weapon.subtype || 'N/A' }}</p>
        </section>
        <img
          class="listing-photo"
          [src]="weapon.image"
          alt="Image of {{ weapon.name }}"
        />
      </article>
    }
    @if (loadError) {
      <p class="listing-location">{{ loadError }}</p>
    }
  `,
  styleUrls: ['./details.css'],
})
export class WeaponDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  weaponsService = inject(WeaponsService);
  readonly weapon$: Observable<TerrariaWeaponInfo | undefined>;
  loadError = '';

  constructor() {
    this.weapon$ = this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => {
        if (!Number.isFinite(id)) {
          this.loadError = 'El id del arma no es valido.';
          return of(undefined);
        }

        return this.weaponsService.getWeaponById(id).pipe(
          map((weapon) => {
            if (!weapon) {
              this.loadError = 'Weapon not found.';
            } else {
              this.loadError = '';
            }
            return weapon;
          }),
          catchError(() => {
            this.loadError = 'No se pudo cargar el detalle del arma.';
            return of(undefined);
          }),
        );
      }),
    );
  }
}
