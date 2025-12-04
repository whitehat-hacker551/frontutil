import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';

import { AlcaldeService } from '../../../service/alcalde';
import { IAlcalde } from '../../../model/alcalde';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { AlcaldeUnroutedUserCard } from '../unrouted-user-card/unrouted-user-card';

@Component({
  selector: 'app-alcalde-user-plist',
  imports: [Paginacion, AlcaldeUnroutedUserCard, RouterLink],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class AlcaldeRoutedUserPlist {
  featured: IAlcalde[] = [];
  genreFilter = 'Todos';
  minRating = 0;
  genreOptions: string[] = [];

  pagePublished: IPage<IAlcalde> | null = null;
  numPage = 0;
  numRpp = 3;

  loadingFeatured = false;
  loadingPage = false;

  constructor(private service: AlcaldeService) { }

  ngOnInit() {
    this.loadFeatured();
    this.loadPublished();
  }

  get filteredFeatured(): IAlcalde[] {
    return this.featured.filter((item) => {
      const genreMatches = this.genreFilter === 'Todos' || item.genero === this.genreFilter;
      const ratingMatches = item.valoracion >= this.minRating;
      return genreMatches && ratingMatches;
    });
  }

  loadFeatured() {
    this.loadingFeatured = true;
    this.service.selection().subscribe({
      next: (data) => {
        this.featured = data;
        this.genreOptions = Array.from(new Set(data.map((d) => d.genero)));
        this.loadingFeatured = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loadingFeatured = false;
      }
    });
  }

  loadPublished() {
    this.loadingPage = true;
    this.service.getPage(this.numPage, this.numRpp, 'fechaLectura', 'desc', true).subscribe({
      next: (data) => {
        this.pagePublished = data;
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.loadPublished();
        } else {
          this.loadingPage = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loadingPage = false;
      }
    });
  }

  onGenreChange(value: string) {
    this.genreFilter = value;
  }

  onRatingChange(value: string) {
    this.minRating = Number(value);
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.loadPublished();
    return false;
  }
}
