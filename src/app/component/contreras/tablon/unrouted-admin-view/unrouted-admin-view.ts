import { Component, Input } from '@angular/core';
import { ITablon } from '../../model/tablon';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminView {
  @Input() oTablon: ITablon | null = null;

}
