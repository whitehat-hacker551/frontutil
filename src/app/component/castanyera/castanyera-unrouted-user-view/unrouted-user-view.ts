import { Component, Input } from '@angular/core';
import { ICastanyera } from '../../../model/castanyera';
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'castanyera-app-unrouted-user-view',
  imports: [DatetimePipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class CastanyeraUnroutedUserView {
  @Input() oCastanyera: ICastanyera | null = null;
  
}
