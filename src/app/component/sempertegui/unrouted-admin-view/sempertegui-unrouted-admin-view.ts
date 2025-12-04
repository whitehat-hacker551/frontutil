import { Component, Input } from '@angular/core';
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';

@Component({
  selector: 'app-sempertegui-unrouted-admin-view',
  imports: [],
  templateUrl: './sempertegui-unrouted-admin-view.html',
  styleUrl: './sempertegui-unrouted-admin-view.css',
})
export class SemperteguiUnroutedAdminView {
  @Input() movie: IPelicula | null = null;
  @Input() ocultarBtnVolver?: boolean = false;
}
