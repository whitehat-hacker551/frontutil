import { Component, Input } from '@angular/core';
import { ICastanyera } from '../../../model/castanyera';

@Component({
  selector: 'castanyera-app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class CastanyeraUnroutedAdminView {
  @Input() oCastanyera: ICastanyera | null = null;

}
