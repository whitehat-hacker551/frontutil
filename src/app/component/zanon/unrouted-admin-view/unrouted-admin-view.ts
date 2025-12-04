import { Component, Input } from '@angular/core';
import { IZanon } from '../../../model/zanon/zanon';

@Component({
  selector: 'app-unrouted-admin-view',
  imports: [],
  templateUrl: './unrouted-admin-view.html',
  styleUrl: './unrouted-admin-view.css',
})
export class UnroutedAdminView {
  @Input() oZanon: IZanon | null = null;
}
