import { UnroutedAlcanyizAdminView } from './../unrouted-alcanyiz-admin-view/unrouted-alcanyiz-admin-view';
import { Component } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';


@Component({
  selector: 'app-routed-alcanyiz-admin-view',
  imports: [UnroutedAlcanyizAdminView],
  templateUrl: './routed-alcanyiz-admin-view.html',
  styleUrl: './routed-alcanyiz-admin-view.css',
})
export class RoutedAlcanyizAdminView {
oQuestion: questionModel | null = null;

  constructor(private oQuestionService: jsQuestionService, private route: ActivatedRoute) {
    // Obtener el ID del blog desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const questionId = idParam ? Number(idParam) : NaN;
    if (isNaN(questionId)) {
      console.error('Invalid blog id:', idParam);
      return;
    }
    this.getQuestion(questionId);
  }

  ngOnInit() { }
  getQuestion(questionId: number) {
    this.oQuestionService.get(questionId).subscribe({
      next: (data: questionModel) => {
        console.log('Pregunta recibida:', data);
        this.oQuestion = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching pregunta:', {
          status: error.status,
          message: error.message,
          errorBody: error.error
        });
      },
    });
  }
}
