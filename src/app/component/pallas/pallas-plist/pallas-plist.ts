import { Component, OnInit } from '@angular/core';
import { IPage } from '../../../model/plist';
import { IPallas } from '../../../model/pallas';
import { PallasService } from '../../../service/pallasService';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';


@Component({
  selector: 'app-pallas-plist',
  imports: [RouterLink, DatePipe, Paginacion, BotoneraRpp],
  templateUrl: './pallas-plist.html',
  styleUrl: './pallas-plist.css',
})
export class PallasPlist implements OnInit {

  oPage: IPage<IPallas> | null = null; // Página de datos
  nPage: number = 0;   // Página actual
  nRpp: number = 10;   // Registros por página
  strResult: string = ""; // Mensajes para el usuario

  constructor(
    private oPallasService: PallasService
  ) { }


  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oPallasService.getPage(this.nPage, this.nRpp).subscribe({
      next: (data: IPage<IPallas>) => {
        this.oPage = data;
        
        // Comprobación de seguridad
        if (this.nPage > 0 && this.nPage >= data.totalPages) {
          this.nPage = data.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.strResult = "Error al cargar: " + error.message;
        console.error(error);
      }
    });
  }

  // 2. FUNCIÓN PARA RELLENAR
  rellenar() {
    this.oPallasService.rellenar(50).subscribe({
      next: (num: number) => {
        this.strResult = "Se han creado " + num + " registros nuevos.";
        this.getPage(); // Recargamos la tabla para verlos
      },
      error: (err: HttpErrorResponse) => {
        this.strResult = "Error: " + err.message;
      }
    });
  }


  onSetPage(nPage: number) {
    this.nPage = nPage;
    this.getPage();
  }


  onSetRpp(nRpp: number) {
    this.nRpp = nRpp;
    this.getPage();
  }
}
