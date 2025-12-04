import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { SalinasService } from '../../../service/salinas-receta';
import { ISalinasReceta } from '../../../model/salinas-receta';
import { SalinasUnroutedUserView } from '../unrouted-user-view/unrouted-user-view';


@Component({
  selector: 'app-salinas-routed-user-view',
  imports: [SalinasUnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class SalinasRoutedUserView {
  oSalinasReceta: ISalinasReceta | null = null;

  constructor(private oSalinasService: SalinasService, private route: ActivatedRoute) {
    // Obtener el ID de la receta desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const salinasRecetaId = idParam ? Number(idParam) : NaN;
    if (isNaN(salinasRecetaId)) {
      console.error('Invalid receta id:', idParam);
      return;
    }
    this.getReceta(salinasRecetaId);
  }

  ngOnInit() { }

  getReceta(salinasRecetaId: number) {
    this.oSalinasService.get(salinasRecetaId).subscribe({
      next: (data: ISalinasReceta) => {
        this.oSalinasReceta = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching SalinasReceta:', error);
      },
    });
  }
}
