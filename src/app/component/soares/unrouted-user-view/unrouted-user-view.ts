// Componente que muestra el detalle de una pregunta para el usuario
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ISoares } from '../../../model/soares';

@Component({
  selector: 'app-unrouted-user-view-soares',
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnroutedUserViewSoares {
  oSoares = input<ISoares | null>(null);
}
