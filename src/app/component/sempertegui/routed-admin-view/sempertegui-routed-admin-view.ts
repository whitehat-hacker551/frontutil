import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';
import { SemperteguiService } from '../../../service/sempertegui/semperteguiService';
import { SemperteguiUnroutedAdminView } from '../unrouted-admin-view/sempertegui-unrouted-admin-view';

@Component({
  selector: 'app-sempertegui-routed-admin-view',
  imports: [SemperteguiUnroutedAdminView],
  templateUrl: './sempertegui-routed-admin-view.html',
  styleUrl: './sempertegui-routed-admin-view.css',
})
export class SemperteguiRoutedAdminView {
  movie: IPelicula | null = null;

  constructor(private semperteguiService: SemperteguiService, private route: ActivatedRoute) {
    // Obtener el ID del la película desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const movieId = idParam ? Number(idParam) : NaN;
    if (isNaN(movieId)) {
      console.error('Invalid movie id:', idParam);
      return;
    }
    this.getMovie(movieId);
  }

  ngOnInit() { }

  getMovie(movieId: number) {
    this.semperteguiService.get(movieId).subscribe({
      next: (data: IPelicula) => {
        this.movie = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching movie:', error);
      },
    });
  }
}
