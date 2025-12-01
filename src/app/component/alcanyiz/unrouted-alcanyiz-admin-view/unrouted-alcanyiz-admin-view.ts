import { Component, Input } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';

@Component({
  selector: 'app-unrouted-alcanyiz-admin-view',
  imports: [],
  templateUrl: './unrouted-alcanyiz-admin-view.html',
  styleUrl: './unrouted-alcanyiz-admin-view.css',
})
export class UnroutedAlcanyizAdminView {
  @Input() oQuestion: questionModel | null = null;
}
