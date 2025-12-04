import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';
import { IPage } from '../../../model/plist';
import { ICalinescu } from '../../../model/calinescu';
import { CalinescuService } from '../../../service/calinescu.service';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

/**
 * Componente para mostrar el listado paginado de items de la lista de compras (vista admin).
 * 
 * Proporciona funcionalidades de administración como:
 * - Visualización de items en tabla paginada
 * - Control de registros por página (RPP)
 * - Generación de datos de prueba
 * - Enlaces a edición, visualización y eliminación de items
 */
@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe, DecimalPipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlistCalinescu {
  /** Objeto de página con los items y metadatos de paginación */
  oPage: IPage<ICalinescu> | null = null;
  
  /** Número de página actual (base 0) */
  numPage: number = 0;
  
  /** Cantidad de registros por página */
  numRpp: number = 5;
  
  /** Cantidad de items a generar en la función de relleno */
  rellenaCantidad: number = 10;
  
  /** Indica si se está ejecutando la operación de relleno */
  rellenando: boolean = false;
  
  /** Número de items creados exitosamente en el último relleno */
  rellenaOk: number | null = null;
  
  /** Mensaje de error si falla la operación de relleno */
  rellenaError: string | null = null;
  totalGlobal: number = 0;
  borrandoTodo: boolean = false;

  constructor(private oCalinescuService: CalinescuService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.obtenerPagina();
    this.cargarTotalGlobal();
  }

  /**
   * Obtiene la página actual de items desde el servidor.
   * Valida que la página solicitada exista y ajusta si es necesario.
   */
  obtenerPagina() {
    this.oCalinescuService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<ICalinescu>) => {
        this.oPage = data;
        this.rellenaOk = this.oPage.totalElements;
        // si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.obtenerPagina();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  /**
   * Navega a una página específica del listado.
   * 
   * @param numPage - Número de página a mostrar
   * @returns false para prevenir comportamiento por defecto del evento
   */
  irAPagina(numPage: number) {
    this.numPage = numPage;
    this.obtenerPagina();
    return false;
  }

  /**
   * Cambia la cantidad de registros mostrados por página.
   * 
   * @param n - Nueva cantidad de registros por página
   * @returns false para prevenir comportamiento por defecto del evento
   */
  cambiarRpp(n: number) {
    this.numRpp = n;
    this.obtenerPagina();
    return false;
  }

  /**
   * Actualiza la cantidad de items a generar en el relleno.
   * 
   * @param value - Nuevo valor de cantidad como string
   * @returns false para prevenir comportamiento por defecto del evento
   */
  cambiarCantidad(value: string) {
    this.rellenaCantidad = +value;
    return false;
  }

  calcularTotal(): number {
    if (!this.oPage || !this.oPage.content) return 0;
    return this.oPage.content.reduce((sum, item) => sum + (item.precio || 0), 0);
  }

  cargarTotalGlobal() {
    this.oCalinescuService.getTotalPrecios().subscribe({
      next: (total: number) => {
        this.totalGlobal = total;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar total global:', error);
      },
    });
  }

  generarDatosFalsos() {
    this.rellenaOk = null;
    this.rellenaError = null;
    this.rellenando = true;
    this.oCalinescuService.rellenaListaCompra(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.obtenerPagina();
        this.cargarTotalGlobal(); // Actualizar total después de generar datos
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos fake';
        console.error(err);
      }
    });
  }

  confirmarBorrarTodo() {
    this.borrandoTodo = true;
    this.rellenaError = null;
    this.oCalinescuService.deleteAll().subscribe({
      next: (count: number) => {
        this.borrandoTodo = false;
        this.rellenaOk = 0;
        this.obtenerPagina();
        this.cargarTotalGlobal();
      },
      error: (err: HttpErrorResponse) => {
        this.borrandoTodo = false;
        this.rellenaError = 'Error al borrar todos los elementos';
        console.error(err);
      }
    });
  }
}
