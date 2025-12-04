import { Component, Input } from '@angular/core';
import { ITablon } from '../../model/tablon';
import { DatetimePipe } from "../../../../pipe/datetime-pipe";

@Component({
  selector: 'app-unrouted-user-view',
  imports: [DatetimePipe],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class UnroutedUserView {
  @Input() oTablon: ITablon | null = null;
  
}
