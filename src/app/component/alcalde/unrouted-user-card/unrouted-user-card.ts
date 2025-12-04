import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IAlcalde } from '../../../model/alcalde';

@Component({
  selector: 'app-alcalde-user-card',
  imports: [RouterLink],
  templateUrl: './unrouted-user-card.html',
  styleUrl: './unrouted-user-card.css',
})
export class AlcaldeUnroutedUserCard {
  @Input() entry: IAlcalde | null = null;
  @Input() showActions: boolean = true;

  stars = [1, 2, 3, 4, 5];

  getPreview(maxLength: number = 180): string {
    const text = this.entry?.reseña || '';
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trimEnd() + '...';
  }
}
