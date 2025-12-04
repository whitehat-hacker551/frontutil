import { Component, Input } from '@angular/core';
import { DatetimePipe } from "../../../pipe/datetime-pipe";
import { ISalinasReceta } from '../../../model/salinas-receta';

@Component({
  selector: 'app-salinas-unrouted-user-view',
  imports: [DatetimePipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class SalinasUnroutedUserView {
  @Input() oSalinasReceta: ISalinasReceta| null = null;
  
}
