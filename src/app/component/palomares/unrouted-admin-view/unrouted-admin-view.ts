import { Component, Input } from '@angular/core';
import { IPalomares } from '../../../model/palomares';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminView {
  @Input() oPalomares: IPalomares | null = null;

}
