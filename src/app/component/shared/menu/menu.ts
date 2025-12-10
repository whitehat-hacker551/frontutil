import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-menu',
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  activeRoute: string = '';
  isSessionActive: boolean = false;

  constructor(private oRouter: Router, private oSessionService: SessionService) {
    // obtener la ruta activa a partir del router
    this.oRouter.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
    this.isSessionActive = this.oSessionService.isSessionActive();
  }

  ngOnInit(): void {
    this.oSessionService.subjectLogin.subscribe(() => {      
      //ocultar el boton de iniciar sesión
      this.isSessionActive = true;      
    });

    this.oSessionService.subjectLogout.subscribe(() => {
      // Aquí puedes manejar la lógica que necesites cuando se cierre sesión
      this.isSessionActive = false;      
    });
  }
}
