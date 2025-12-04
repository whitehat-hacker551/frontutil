import { Component } from '@angular/core';
import { IPalomares } from '../../../model/palomares';
import { PalomaresService } from '../../../service/palomares';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'app-routed-admin-view',
  imports: [UnroutedAdminView],
  templateUrl: './routed-admin-view.html',
  styleUrl: './routed-admin-view.css',
})
export class RoutedAdminView {
  oPalomares: IPalomares | null = null;

  constructor(private oPalomaresService: PalomaresService, private route: ActivatedRoute) {
    // Obtener el ID de la tarea desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const tareaId = idParam ? Number(idParam) : NaN;
    if (isNaN(tareaId)) {
      console.error('Invalid tarea id:', idParam);
      return;
    }
    this.getPalomares(tareaId);
  }

  ngOnInit() { }

  getPalomares(tareaId: number) {
    this.oPalomaresService.get(tareaId).subscribe({
      next: (data: IPalomares) => {
        this.oPalomares = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching tarea:', error);
      },
    });
  }
}
