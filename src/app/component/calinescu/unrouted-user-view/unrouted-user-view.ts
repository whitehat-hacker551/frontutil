import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ICalinescu } from '../../../model/calinescu';
import { DatetimePipe } from "../../../pipe/datetime-pipe";

/**
 * Componente no enrutado para mostrar los detalles de un item (vista usuario).
 * 
 * Este componente recibe un item como input y lo muestra en un formato
 * orientado al usuario final, con formato de fecha legible.
 * Es reutilizable en diferentes contextos de visualización.
 */
@Component({
  selector: 'app-unrouted-user-view-calinescu',
  imports: [DatetimePipe, DecimalPipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class UnroutedUserViewCalinescu {
  /** Item a mostrar en la vista */
  @Input() oCalinescu: ICalinescu | null = null;
  
}
