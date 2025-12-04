import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../model/plist';
import { ITablon } from '../../model/tablon';
import { TablonService } from '../../service/tablon';
import { Paginacion } from "../../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../../shared/botonera-rpp/botonera-rpp";
import { DatetimePipe } from "../../../../pipe/datetime-pipe";

@Component({
  selector: 'app-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp, DatetimePipe],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class RoutedAdminPlist {
  oPage: IPage<ITablon> | null = null;
  numPage: number = 0;
  numRpp: number = 5;

  constructor(private oTablonService: TablonService, private router: Router) { }
  volver() {
    this.router.navigate(['']);
  }

  oBotonera: string[] = [];

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oTablonService.getPage(this.numPage, this.numRpp).subscribe({
      next: (data: IPage<ITablon>) => {
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
}
