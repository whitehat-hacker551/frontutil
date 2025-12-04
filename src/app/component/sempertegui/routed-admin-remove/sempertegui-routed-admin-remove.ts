import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { SemperteguiUnroutedAdminView } from "../unrouted-admin-view/sempertegui-unrouted-admin-view";
import { SemperteguiService } from '../../../service/sempertegui/semperteguiService';
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';

@Component({
  selector: 'app-sempertegui-routed-admin-remove',
  imports: [SemperteguiUnroutedAdminView],
  templateUrl: './sempertegui-routed-admin-remove.html',
  styleUrl: './sempertegui-routed-admin-remove.css'
})
export class SemperteguiRoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private semperteguiService = inject(SemperteguiService);

  movie: IPelicula | null = null;
  loading: boolean = true;
  error: string | null = null;
  deleting: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(+id);
  }

  load(id: number) {
    this.semperteguiService.get(id).subscribe({
      next: (data: IPelicula) => {
        this.movie = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando la película';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.movie) return;
    this.deleting = true;
    this.semperteguiService.delete(this.movie.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/sempertegui/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el post';
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/sempertegui/plist']);
  }
}
