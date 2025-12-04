import { Component, input } from '@angular/core';
import { IFernandezIdea } from '../../../model/fernandez-idea';

@Component({
  selector: 'app-fernandez-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class FernandezUnroutedAdminView {
  oIdea = input<IFernandezIdea | null>(null);
}
