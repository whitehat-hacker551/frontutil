import { Component, Input } from '@angular/core';
import { IAlcalde } from '../../../model/alcalde';

@Component({
  selector: 'app-alcalde-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class AlcaldeUnroutedAdminView {
  @Input() entry: IAlcalde | null = null;

  getPublicadoLabel(value?: boolean | null) {
    return value ? 'Publicado' : 'Borrador';
  }

  getDestacadoLabel(value?: boolean | null) {
    return value ? 'Destacado' : 'Listado';
  }
}
