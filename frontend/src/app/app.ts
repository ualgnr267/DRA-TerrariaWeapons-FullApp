import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: ` 
    <main>
      <header class="brand-name">
        <a [routerLink]="['/']" class="brand-link">Armas Terraria</a>
      </header>
      <section class="content">
        <router-outlet />
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class App {
  
}
