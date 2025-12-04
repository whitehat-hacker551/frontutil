import { Component, Input, OnInit } from '@angular/core';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-unrouted-alcanyiz-user-view',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './unrouted-alcanyiz-user-view.html',
  styleUrls: ['./unrouted-alcanyiz-user-view.css'],
})
export class UnroutedAlcanyizUserView implements OnInit {
  @Input() oQuestion: questionModel | null = null;

  // single control to hold selected answer (number 1..4)
  form: FormGroup = new FormGroup({
    selected: new FormControl<number | null>(null, [Validators.required]),
  });

  result: 'correct' | 'incorrect' | null = null;
  correctAnswerText: string | null = null;

  ngOnInit(): void {
    // reset state on init
    this.result = null;
    this.correctAnswerText = null;
    this.form.reset();
  }

  get options() {
    return [
      { index: 1, text: this.oQuestion?.answer1 ?? '' },
      { index: 2, text: this.oQuestion?.answer2 ?? '' },
      { index: 3, text: this.oQuestion?.answer3 ?? '' },
      { index: 4, text: this.oQuestion?.answer4 ?? '' },
    ];
  }

  onSubmit(): void {
    if (!this.oQuestion) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  const raw = this.form.get('selected')!.value;
  const selected = raw === null ? null : Number(raw);
  if (selected === this.oQuestion.correct) {
      this.result = 'correct';
      this.correctAnswerText = null;
  // lock form to prevent changes after answer
  this.form.disable({ emitEvent: false });
    } else {
      this.result = 'incorrect';
      const correctIndex = this.oQuestion.correct;
      this.correctAnswerText = this.getAnswerText(correctIndex);
  // lock form to prevent changes after answer
  this.form.disable({ emitEvent: false });
    }
  }

  private getAnswerText(index: number): string {
    switch (index) {
      case 1:
        return this.oQuestion?.answer1 ?? '';
      case 2:
        return this.oQuestion?.answer2 ?? '';
      case 3:
        return this.oQuestion?.answer3 ?? '';
      case 4:
        return this.oQuestion?.answer4 ?? '';
      default:
        return '';
    }
  }
}
