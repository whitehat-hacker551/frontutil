import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SalinasService } from '../../../service/salinas-receta';
import { ISalinasReceta } from '../../../model/salinas-receta';
import { SalinasUnroutedAdminView } from '../unrouted-admin-view/unrouted-admin-view';


@Component({
  selector: 'app-salinas-routed-admin-view',
  imports: [SalinasUnroutedAdminView],
  templateUrl: './routed-admin-view.html',
  styleUrl: './routed-admin-view.css',
})
export class SalinasRoutedAdminView {
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
        console.error('Error fetching receta:', error);
      },
    });
  }
}
