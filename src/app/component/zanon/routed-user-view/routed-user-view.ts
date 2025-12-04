import { Component } from '@angular/core';
import { IZanon } from '../../../model/zanon/zanon';
import { ZanonService } from '../../../service/zanon/zanon';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedUserView } from "../unrouted-user-view/unrouted-user-view";

@Component({
  selector: 'app-routed-user-view',
  imports: [UnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class RoutedUserViewZanon {
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
