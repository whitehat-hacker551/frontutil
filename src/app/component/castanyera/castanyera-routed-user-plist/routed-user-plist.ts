import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { IPage } from '../../../model/plist';
import { ICastanyera } from '../../../model/castanyera';
import { CastanyeraService } from '../../../service/castanyera';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { CastanyeraUnroutedUserView2 } from '../castanyera-unrouted-user-view2/unrouted-user-view2';

@Component({
  selector: 'castanyera-app-routed-user-plist',
  imports: [Paginacion, CastanyeraUnroutedUserView2],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class CastanyeraRoutedUserPlist {
  oPage: IPage<ICastanyera> | null = null;
  numPage: number = 0;
  numRpp: number = 2;
 
  constructor(private oCastanyeraService: CastanyeraService) {}

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oCastanyeraService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<ICastanyera>) => {
        
        // Filtrar client-side para mostrar solo publicaciones públicas
        data.content = data.content.filter((item) => item.publico === true);
        data.numberOfElements = data.content.length;
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
