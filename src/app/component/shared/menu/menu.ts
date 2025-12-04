import { Component, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  sessionService = inject(SessionService);
  private oRouter = inject(Router);

  activeRoute: string = '';

  constructor() {
    // obtener la ruta activa a partir del router
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }

  logout(): void {
    this.sessionService.logout();
    this.oRouter.navigate(['/login']);
  }

}
