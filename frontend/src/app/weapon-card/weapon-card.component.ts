import {Component, input} from '@angular/core';
import {TerrariaWeaponInfo} from '../terraria-weapon-info';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-weapon-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="listing">
      <img
        class="listing-photo"
        [src]="weapon().image"
        alt="Image of {{ weapon().name }}"
      />
      <h2 class="listing-heading">{{ weapon().name }}</h2>
      <p class="listing-location"><span class="info-label">Tipo:</span> {{ weapon().category || 'N/A' }}</p>
      <p class="listing-location"><span class="info-label">Modo:</span> {{ weapon().mode || 'N/A' }}</p>
      <a [routerLink]="['/weapon', weapon().id]">View details</a>
    </section>
  `,
  styleUrls: ['./weapon-card.component.css'],
})
export class WeaponCardComponent {
  weapon = input.required<TerrariaWeaponInfo>();
}
