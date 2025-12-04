import { Component } from '@angular/core';
import { ICastanyera } from '../../../model/castanyera';
import { CastanyeraService } from '../../../service/castanyera';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CastanyeraUnroutedAdminView } from "../castanyera-unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'castanyera-app-routed-admin-view',
  imports: [CastanyeraUnroutedAdminView],
  templateUrl: './routed-admin-view.html',
  styleUrl: './routed-admin-view.css',
})
export class CastanyeraRoutedAdminView {
  oCastanyera: ICastanyera | null = null;

  constructor(private oCastanyeraService: CastanyeraService, private route: ActivatedRoute) {
    // Obtener el ID del journal desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const castanyeraId = idParam ? Number(idParam) : NaN;
    if (isNaN(castanyeraId)) {
      console.error('Invalid castanyera id:', idParam);
      return;
    }
    this.getCastanyera(castanyeraId);
  }

  ngOnInit() { }

  getCastanyera(castanyeraId: number) {
    this.oCastanyeraService.get(castanyeraId).subscribe({
      next: (data: ICastanyera) => {
        this.oCastanyera = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching journal:', error);
      },
    });
  }
}
