import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { IPage } from '../../../model/plist';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-routed-alcanyiz-admin-questionlist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './routed-alcanyiz-admin-questionlist.html',
  styleUrl: './routed-alcanyiz-admin-questionlist.css',
})
export class RoutedAlcanyizAdminQuestionlist {
oPage: IPage<questionModel> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rellenaCantidad: number = 10;
  rellenando: boolean = false;
  rellenaOk: number | null = null;
  rellenaError: string | null = null;

  constructor(private oQuestionService: jsQuestionService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oQuestionService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<questionModel>) => {
        this.oPage = data;
        this.rellenaOk = this.oPage.totalElements;
        // si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
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
    this.oQuestionService.rellenaQuestions(this.rellenaCantidad).subscribe({
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
