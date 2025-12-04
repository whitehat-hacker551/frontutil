import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../model/plist';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { MovieCardComponent } from "../movie-card/movie-card";
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';
import { SemperteguiService } from '../../../service/sempertegui/semperteguiService';


@Component({
  selector: 'app-sempertegui-routed-user-plist',
  imports: [Paginacion, MovieCardComponent],
  templateUrl: './sempertegui-routed-user-plist.html',
  styleUrl: './sempertegui-routed-user-plist.css',
})
export class SemperteguiRoutedUserPlist {
  oPage: IPage<IPelicula> | null = null;
  numPage: number = 0;
  numRpp: number = 2;

  constructor(private semperteguiService: SemperteguiService) { }

  oBotonera: string[] = [];
  
  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.semperteguiService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
      next: (data: IPage<IPelicula>) => {
        this.oPage = data;
        // OJO! si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
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

}
