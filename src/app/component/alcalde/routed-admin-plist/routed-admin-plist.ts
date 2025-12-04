import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { IPage } from '../../../model/plist';
import { IAlcalde } from '../../../model/alcalde';
import { AlcaldeService } from '../../../service/alcalde';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';

@Component({
  selector: 'app-alcalde-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class AlcaldeRoutedAdminPlist {
  oPage: IPage<IAlcalde> | null = null;
  numPage = 0;
  numRpp = 5;
  order = 'fechaLectura';
  direction: 'asc' | 'desc' = 'desc';
  onlyPublished = false;

  rellenaCantidad = 25;
  rellenando = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  constructor(private service: AlcaldeService) { }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.service.getPage(this.numPage, this.numRpp, this.order, this.direction, this.onlyPublished).subscribe({
      next: (data: IPage<IAlcalde>) => {
        this.oPage = data;
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

  togglePublished() {
    this.onlyPublished = !this.onlyPublished;
    this.numPage = 0;
    this.getPage();
  }

  changeSort(column: string) {
    if (this.order === column) {
      this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.order = column;
      this.direction = 'asc';
    }
    this.getPage();
  }

  onCantidadChange(value: string) {
    this.rellenaCantidad = +value;
    return false;
  }

  generarFake() {
    this.rellenaOk = null;
    this.rellenaError = null;
    this.rellenando = true;
    this.service.rellena(this.rellenaCantidad).subscribe({
      next: (count: number) => {
        this.rellenando = false;
        this.rellenaOk = count;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        this.rellenando = false;
        this.rellenaError = 'Error generando lecturas';
        console.error(err);
      }
    });
  }
}
