import { Component } from '@angular/core';
import { ICastanyera } from '../../../model/castanyera';
import { CastanyeraService } from '../../../service/castanyera';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CastanyeraUnroutedUserView } from '../castanyera-unrouted-user-view/unrouted-user-view';

@Component({
  selector: 'castanyera-app-routed-user-view',
  imports: [CastanyeraUnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class CastanyeraRoutedUserView {
  oCastanyera: ICastanyera | null = null;
  isPrivate: boolean = false;

  constructor(private oCastanyeraService: CastanyeraService, private route: ActivatedRoute) {
    // Obtener el ID del journal desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const castanyeraId = idParam ? Number(idParam) : NaN;
    if (isNaN(castanyeraId)) {
      console.error('Invalid journal id:', idParam);
      return;
    }
    this.getCastanyera(castanyeraId);
  }

  ngOnInit() {}

  getCastanyera(castanyeraId: number) {
    this.oCastanyeraService.get(castanyeraId).subscribe({
      next: (data: ICastanyera) => {
        if (data && data.publico === false) {
          this.oCastanyera = null;
          this.isPrivate = true;
        } else {
          this.oCastanyera = data;
          this.isPrivate = false;
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching journal:', error);
      },
    });
  }
}
