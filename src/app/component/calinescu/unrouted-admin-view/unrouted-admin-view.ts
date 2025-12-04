import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ICalinescu } from '../../../model/calinescu';

/**
 * Componente no enrutado para mostrar los detalles de un item (vista admin).
 * 
 * Este componente recibe un item como input y lo muestra en un formato
 * adecuado para administradores. Es reutilizable en diferentes contextos
 * (visualización, confirmación de borrado, etc.).
 */
@Component({
  selector: 'app-unrouted-admin-view-calinescu',
  imports: [DecimalPipe],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminViewCalinescu {
  /** Item a mostrar en la vista */
  @Input() oCalinescu: ICalinescu | null = null;

}
