import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ICalinescu } from '../../../model/calinescu';
import { TrimPipe } from "../../../pipe/trim-pipe";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

/**
 * Componente no enrutado para mostrar un item en formato tarjeta (vista usuario).
 * 
 * Este componente presenta el item en un formato compacto tipo tarjeta,
 * ideal para listados. Incluye:
 * - Icono aleatorio relacionado con compras
 * - Truncamiento de texto largo
 * - Formato de fecha legible
 * - Enlace a la vista detallada
 */
@Component({
  selector: 'app-unrouted-user-view2-calinescu',
  imports: [TrimPipe, RouterLink, DatetimePipe, DecimalPipe],
  templateUrl: './unrouted-user-view2.html',
  styleUrl: './unrouted-user-view2.css',
})
export class UnroutedUserView2Calinescu implements OnInit {
  /** Item a mostrar en la tarjeta */
  @Input() oCalinescu: ICalinescu | null = null;

  /** Clase CSS del icono Bootstrap a mostrar (seleccionado aleatoriamente) */
  iconClass: string = 'bi bi-cart-check';

  ngOnInit(): void {
    // Selecciona un icono aleatorio de una lista de iconos relacionados con compras
    const icons: string[] = [
      'bi bi-cart-check',
      'bi bi-bag',
      'bi bi-basket',
      'bi bi-cart',
      'bi bi-list-check',
      'bi bi-clipboard-check',
    ];
    this.iconClass = icons[Math.floor(Math.random() * icons.length)];
  }

}
