// Componente que muestra el detalle de una pregunta para el administrador
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ISoares } from '../../../model/soares';

@Component({
  selector: 'app-unrouted-admin-view-soares',
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnroutedAdminViewSoares {
  oSoares = input<ISoares | null>(null);
}
