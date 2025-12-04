import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { AlcaldeUnroutedUserCard } from '../unrouted-user-card/unrouted-user-card';

@Component({
  selector: 'app-alcalde-user-view',
  imports: [RouterLink, AlcaldeUnroutedUserCard],
  templateUrl: './routed-user-view.html',
  styleUrl: './routed-user-view.css',
})
export class AlcaldeRoutedUserView {
  entry: IAlcalde | null = null;
  loading = true;
  error: string | null = null;

  constructor(private service: AlcaldeService, private route: ActivatedRoute) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isNaN(id)) {
      this.load(id);
    } else {
      this.loading = false;
      this.error = 'Identificador no válido';
    }
  }

  load(id: number) {
    this.service.get(id).subscribe({
      next: (data) => {
        this.entry = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error = 'No se pudo cargar la lectura';
        this.loading = false;
      }
    });
  }
}
