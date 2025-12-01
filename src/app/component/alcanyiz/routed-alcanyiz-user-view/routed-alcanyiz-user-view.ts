import { Component } from '@angular/core';
import { UnroutedAlcanyizUserView } from "../unrouted-alcanyiz-user-view/unrouted-alcanyiz-user-view";
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-routed-alcanyiz-user-view',
  imports: [UnroutedAlcanyizUserView],
  templateUrl: './routed-alcanyiz-user-view.html',
  styleUrl: './routed-alcanyiz-user-view.css',
})
export class RoutedAlcanyizUserView {
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
