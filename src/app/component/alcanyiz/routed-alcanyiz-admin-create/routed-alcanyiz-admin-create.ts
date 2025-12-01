import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-alcanyiz-admin-create',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './routed-alcanyiz-admin-create.html',
  styleUrls: ['./routed-alcanyiz-admin-create.css'],
})
export class RoutedAlcanyizAdminCreate {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private questionService = inject(jsQuestionService);

  questionForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.questionForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(3)]],
      answer1: ['', [Validators.required]],
      answer2: ['', [Validators.required]],
      answer3: ['', [Validators.required]],
      answer4: ['', [Validators.required]],
      correct: [1, [Validators.required, Validators.min(1), Validators.max(4)]],
    });
  }

  onSubmit(): void {
    if (!this.questionForm.valid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<questionModel> = {
      question: this.questionForm.value.question,
      answer1: this.questionForm.value.answer1,
      answer2: this.questionForm.value.answer2,
      answer3: this.questionForm.value.answer3,
      answer4: this.questionForm.value.answer4,
      // ensure numeric
      correct: Number(this.questionForm.value.correct),
    };

    this.questionService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/alcanyiz/questionlist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la pregunta';
        console.error(err);
      },
    });
  }

  get question() {
    return this.questionForm.get('question');
  }

  get answer1() {
    return this.questionForm.get('answer1');
  }
  get answer2() {
    return this.questionForm.get('answer2');
  }
  get answer3() {
    return this.questionForm.get('answer3');
  }
  get answer4() {
    return this.questionForm.get('answer4');
  }

  get correct() {
    return this.questionForm.get('correct');
  }
}

