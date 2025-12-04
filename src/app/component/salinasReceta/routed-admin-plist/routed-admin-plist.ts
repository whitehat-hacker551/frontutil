import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { SalinasService } from '../../../service/salinas-receta';
import { ISalinasReceta } from '../../../model/salinas-receta';
import { CommonModule } from '@angular/common'; // Necesario para @if y @for
import { FormsModule } from '@angular/forms'; // Necesario para el select

@Component({
  selector: 'app-salinas-routed-admin-plist',
  standalone: true, // Asumo que es un componente standalone
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe, CommonModule, FormsModule], // Asegúrate de incluir CommonModule y FormsModule
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class SalinasRoutedAdminPlist {
  oPage: IPage<ISalinasReceta> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  constructor(private oSalinasService: SalinasService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    // Usamos 'id' y 'asc' como ordenación por defecto
    this.oSalinasService.getPage(this.numPage, this.numRpp, 'id', 'asc').subscribe({ 
      next: (data: IPage<ISalinasReceta>) => {
        this.oPage = data;
        // La variable rellenaOk ahora solo muestra el éxito del bulkCreate, no el total
        // this.rellenaOk = this.oPage.totalElements; // LINEA ELIMINADA (confunde el mensaje de éxito)
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.getPage();
    return false;
  }

  onRppChange(n: number) {
    this.numRpp = n;
    this.getPage();
    return false;
  }

  onCantidadChange(value: string) {
    this.rellenaCantidad = +value;
    return false;
  }

  generarFake() {
    this.rellenaOk = null;
    this.rellenaError = null;
    this.rellenando = true;
    
    // ¡CORRECCIÓN AQUÍ! Llama al método bulkCreate del servicio
    this.oSalinasService.bulkCreate(this.rellenaCantidad).subscribe({ 
      next: (count: number) => {
        this.rellenando = false;
        // El backend devuelve el total. Aquí mostramos la cantidad generada.
        this.rellenaOk = this.rellenaCantidad; 
        this.numPage = 0; // Ir a la primera página para ver los nuevos datos
        this.getPage(); // refrescamos listado
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando datos fake';
        console.error(err);
      }
    });
  }
}
