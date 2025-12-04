import { Component, Input } from '@angular/core';
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.html',
  styleUrls: ['./movie-card.css']
})
export class MovieCardComponent {
  // El componente recibe un objeto 'movie' como entrada.
  @Input() movie!: IPelicula;
}