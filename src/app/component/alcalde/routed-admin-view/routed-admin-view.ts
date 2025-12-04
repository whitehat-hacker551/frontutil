import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { IAlcalde } from '../../../model/alcalde';
import { AlcaldeService } from '../../../service/alcalde';
import { AlcaldeUnroutedAdminView } from '../unrouted-admin-view/unrouted-admin-view';

@Component({
  selector: 'app-alcalde-admin-view-routed',
  imports: [AlcaldeUnroutedAdminView],
  templateUrl: './routed-admin-view.html',
  styleUrl: './routed-admin-view.css',
})
export class AlcaldeRoutedAdminView {
  entry: IAlcalde | null = null;
  error: string | null = null;

  constructor(private service: AlcaldeService, private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id)) {
      this.load(id);
    } else {
      this.error = 'Identificador no valido';
    }
  }

  load(id: number) {
    this.service.get(id).subscribe({
      next: (data) => {
        this.entry = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error = 'No se pudo obtener la lectura';
      }
    });
  }
}
