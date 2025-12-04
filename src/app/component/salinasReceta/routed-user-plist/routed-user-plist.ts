import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../model/plist';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { ISalinasReceta } from '../../../model/salinas-receta';
import { SalinasService } from '../../../service/salinas-receta';
import { SalinasUnroutedUserView2 } from '../unrouted-user-view2/unrouted-user-view2';


@Component({
  selector: 'app-salinas-routed-user-plist',
  imports: [Paginacion, SalinasUnroutedUserView2],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class SalinasRoutedUserPlist {
  oPage: IPage<ISalinasReceta> | null = null;
  numPage: number = 0;
  numRpp: number = 2;

  constructor(private oSalinasService: SalinasService) { }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oSalinasService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc').subscribe({
      next: (data: IPage<ISalinasReceta>) => {
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
