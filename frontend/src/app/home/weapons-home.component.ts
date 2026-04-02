import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, of } from 'rxjs';
import { WeaponCardComponent } from '../weapon-card/weapon-card.component';
import { TerrariaWeaponInfo } from '../terraria-weapon-info';
import { WeaponsService } from '../weapons.service';

@Component({
  selector: 'app-weapons-home',
  standalone: true,
  imports: [WeaponCardComponent, AsyncPipe],
  template: `
    <section>
      <form autocomplete="off" (submit)="$event.preventDefault(); filterResults(filter.value)">
        <input
          type="text"
          placeholder="Filter by weapon type (e.g. Swords)"
          [value]="initialFilter"
          #filter
          autocomplete="off"
        />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    @if (loadError) {
      <section>
        <p>{{ loadError }}</p>
      </section>
    }
    <section class="results">
      @if (filteredWeaponList$ | async; as list) {
        @for (weapon of list; track weapon.id) {
          <app-weapon-card [weapon]="weapon" />
        }
      }
    </section>
  `,
  styleUrls: ['./home.css'],
})
export class WeaponsHomeComponent {
  weaponsService: WeaponsService = inject(WeaponsService);
  private readonly filterQuery$ = new BehaviorSubject<string>('');
  readonly initialFilter: string;
  loadError = '';

  readonly filteredWeaponList$ = combineLatest([
    this.weaponsService.getAllWeapons(),
    this.filterQuery$,
  ]).pipe(
    map(([list, query]) => {
      const normalized = query.toLowerCase();
      if (!normalized) {
        return list;
      }

      return list.filter((weapon: TerrariaWeaponInfo) =>
        weapon.name.toLowerCase().includes(normalized) ||
        (weapon.category ?? '').toLowerCase().includes(normalized) ||
        (weapon.mode ?? '').toLowerCase().includes(normalized) ||
        (weapon.subtype ?? '').toLowerCase().includes(normalized),
      );
    }),
    catchError(() => {
      this.loadError = 'Could not load weapons from API. Please retry.';
      return of([] as TerrariaWeaponInfo[]);
    }),
  );

  constructor() {
    this.initialFilter = this.weaponsService.getCurrentFilter();
    this.filterQuery$.next(this.initialFilter);
  }

  filterResults(text: string): void {
    const normalized = text?.trim() ?? '';
    this.weaponsService.setCurrentFilter(normalized);
    this.filterQuery$.next(normalized);
  }
}
