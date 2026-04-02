import {Routes} from '@angular/router';
import {WeaponsHomeComponent} from './home/weapons-home.component';
import { WeaponDetailsComponent } from './details/weapon-details.component';

const routeConfig: Routes = [
  {
    path: '',
    component: WeaponsHomeComponent,
    title: 'Terraria Weapons',
  },
  {
    path: 'weapon/:id',
    component: WeaponDetailsComponent,
    title: 'Weapon details',
  },
];

export default routeConfig;