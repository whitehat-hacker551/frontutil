import { Component, Input } from '@angular/core';
import { IZanon } from '../../../model/zanon/zanon';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-unrouted-user-view',
  imports: [RouterLink],
  templateUrl: './unrouted-user-view.html',
  styleUrl: './unrouted-user-view.css',
})
export class UnroutedUserView {
  @Input() oZanon: IZanon | null = null;
}
