import { Component } from '@angular/core';
import { IZanon } from '../../../model/zanon/zanon';
import { ZanonService } from '../../../service/zanon/zanon';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'app-routed-admin-view',
  imports: [UnroutedAdminView],
  templateUrl: './routed-admin-view.html',
  styleUrl: './routed-admin-view.css',
})
export class RoutedAdminViewZanon {
  oZanon: IZanon | null = null;

  constructor(private oZanonService: ZanonService, private route: ActivatedRoute) {
    // Obtener el ID del blog desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const zanonId = idParam ? Number(idParam) : NaN;
    if (isNaN(zanonId)) {
      console.error('Invalid blog id:', idParam);
      return;
    }
    this.getBlog(zanonId);
  }

  ngOnInit() {

  }

  getBlog(zanonId: number) {
    this.oZanonService.get(zanonId).subscribe({
      next: (data: IZanon) => {
        this.oZanon = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching blog:', error);
      },
    });
  }
}
