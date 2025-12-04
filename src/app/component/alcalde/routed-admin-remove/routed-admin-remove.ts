import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { AlcaldeUnroutedAdminView } from '../unrouted-admin-view/unrouted-admin-view';

@Component({
  selector: 'app-alcalde-admin-remove',
  imports: [AlcaldeUnroutedAdminView],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css',
})
export class AlcaldeRoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(AlcaldeService);

  entry: IAlcalde | null = null;
  loading = true;
  deleting = false;
  error: string | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isNaN(id)) {
      this.error = 'Identificador no valido';
      this.loading = false;
      return;
    }
    this.load(id);
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

  confirmDelete() {
    if (!this.entry) {
      return;
    }
    this.deleting = true;
    this.service.delete(this.entry.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/alcalde/plist']);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.error = 'No se pudo borrar la lectura';
        this.deleting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/alcalde/plist']);
  }
}
