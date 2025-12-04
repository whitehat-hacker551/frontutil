import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { IPalomares } from '../../../model/palomares';
import { PalomaresService } from '../../../service/palomares';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlist {
  oPage: IPage<IPalomares> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  constructor(private oPalomaresService: PalomaresService) {
    console.log('RoutedAdminPlist - Constructor inicializado');
  }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    console.log('Llamando a getPage - Página:', this.numPage, 'RPP:', this.numRpp);
    this.oPalomaresService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<IPalomares>) => {
        console.log('✅ Datos recibidos del servidor:', data);
        console.log('📊 Estructura de data:', {
          content: data.content,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          number: data.number
        });
        console.log('📝 Contenido del array:', data.content);
        console.log('📏 Longitud del array content:', data.content?.length);
        
        this.oPage = data;
        this.rellenaOk = this.oPage.totalElements;
        
        // si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar datos:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error completo:', error);
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
    this.oPalomaresService.rellenaPalomares(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
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
