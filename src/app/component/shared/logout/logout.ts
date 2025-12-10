import { Component, inject, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../service/session.service';

@Component({
  selector: 'app-logout',
  imports: [RouterModule],
  templateUrl: './logout.html',
  styleUrl: './logout.css',
})
export class Logout {

  @Inject(SessionService)
  private oSessionService = inject(SessionService);
  //inyectar router module
  private oRouter = inject(Router);
  onLogout(): boolean {
    this.oSessionService.clearToken();
    this.oRouter.navigate(['/']);
    return false;
  }
}
