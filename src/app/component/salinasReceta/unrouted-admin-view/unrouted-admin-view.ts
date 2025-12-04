import { Component, Input } from '@angular/core';
import { ISalinasReceta } from '../../../model/salinas-receta';


@Component({
  selector: 'app-salinas-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class SalinasUnroutedAdminView {
  @Input() oSalinasReceta: ISalinasReceta | null = null;

}
