import { Component, Input } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { TrimPipe } from "../../../pipe/trim-pipe";
import { RouterLink } from '@angular/router';
import { DatetimePipe } from "../../../pipe/datetime-pipe";


@Component({
  selector: 'app-unrouted-alcanyiz-user-view2',
  imports: [TrimPipe, RouterLink, DatetimePipe],
  templateUrl: './unrouted-alcanyiz-user-view2.html',
  styleUrl: './unrouted-alcanyiz-user-view2.css',
})
export class UnroutedAlcanyizUserView2 {
  @Input() oQuestion: questionModel | null = null;

  iconClass: string = 'bi bi-newspaper';

  ngOnInit(): void {
    const icons: string[] = [
      'bi bi-newspaper',
      'bi bi-eye',
      'bi bi-journal-text',
      'bi bi-card-text',
      'bi bi-file-earmark-text',
      'bi bi-book',
    ];
    this.iconClass = icons[Math.floor(Math.random() * icons.length)];
  }
}
