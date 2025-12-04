import { Component, input } from '@angular/core';
import { IFernandezIdea } from '../../../model/fernandez-idea';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fernandez-unrouted-user-view',
  imports: [RouterLink],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class FernandezUnroutedUserView {
  oIdea = input<IFernandezIdea | null>(null);
}
