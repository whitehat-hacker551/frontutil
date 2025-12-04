import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPalomares } from '../../../model/palomares';
import { TrimPipe } from "../../../pipe/trim-pipe";
import { DatetimePipe } from "../../../pipe/datetime-pipe";

@Component({
  selector: 'app-unrouted-user-view2',
  imports: [TrimPipe, RouterLink, DatetimePipe],
  templateUrl: './unrouted-user-view2.html',
  styleUrl: './unrouted-user-view2.css',
})
export class UnroutedUserView2 implements OnInit {
  @Input() oPalomares: IPalomares | null = null;

  iconClass: string = 'bi bi-list-check';

  ngOnInit(): void {
    const icons: string[] = [
      'bi bi-list-check',
      'bi bi-check2-square',
      'bi bi-clipboard-check',
      'bi bi-journal-check',
      'bi bi-card-checklist',
      'bi bi-clipboard2-check',
    ];
    this.iconClass = icons[Math.floor(Math.random() * icons.length)];
  }

}
