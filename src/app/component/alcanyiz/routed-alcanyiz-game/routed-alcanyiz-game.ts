import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jsQuestionService } from '../../../service/alcanyiz/jsquestions';
import { questionModel } from '../../../model/alcanyiz/questionsModel_Alan';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

interface Question {
  id: string;
  text: string;
  choices: string[];
  correct: number; // index
}

@Component({
  selector: 'app-routed-alcanyiz-game',
  imports: [CommonModule],
  templateUrl: './routed-alcanyiz-game.html',
  styleUrls: ['./routed-alcanyiz-game.css'],
})
export class RoutedAlcanyizGame {
  score = 0;
  completed: boolean[] = Array(9).fill(false);

  // dialog state
  dialogOpen = false;
  dialogQuestions: Question[] = [];
  currentQ = 0;
  selectedChoice: number | null = null;
  currentButtonIndex: number | null = null;

  // bank will be filled from server
  private bank: Question[][] = [];
  allQuestions: Question[] = [];

  constructor(private oQuestionService: jsQuestionService, private router: Router){}

  ngOnInit(){
    // load up to 36 questions from API and partition into groups of 4
    this.oQuestionService.getPage(0, 36, 'id', 'asc').subscribe({
      next: (page) => {
        const items = (page && page.content) ? page.content : [];
        // convert backend model to local Question shape
        this.allQuestions = items.map((it: questionModel, idx: number) => ({
          id: String(it.id),
          text: it.question,
          choices: [it.answer1, it.answer2, it.answer3, it.answer4],
          correct: Number(it.correct) - 1 // backend uses 1..4, convert to 0..3
        }));
        // partition into 9 groups of 4; if not enough, reuse or fill
        const perGroup = 4;
        for(let g=0; g<9; g++){
          const start = g*perGroup;
          const slice = this.allQuestions.slice(start, start+perGroup);
          if(slice.length === perGroup){
            this.bank[g] = slice;
          } else if(slice.length > 0){
            // if fewer than required, pad by repeating
            const padded = slice.slice();
            while(padded.length < perGroup){ padded.push(slice[padded.length % slice.length]); }
            this.bank[g] = padded;
          } else {
            // fallback: create trivial filler questions
            this.bank[g] = Array.from({length:perGroup}, (_,i)=>({ id: `f${g}${i}`, text: 'Pregunta demo', choices:['A','B','C','D'], correct:0 }));
          }
        }
      },
      error: (err: HttpErrorResponse) => { console.error('Could not load questions', err); }
    });
  }

  openDialog(buttonIndex: number){
    if(this.completed[buttonIndex]) return; // already done
    this.currentButtonIndex = buttonIndex;
    this.dialogQuestions = this.bank[buttonIndex] || this.bank[0];
    this.currentQ = 0;
    this.selectedChoice = null;
    this.dialogOpen = true;
  }

  selectChoice(idx: number){ this.selectedChoice = idx }

  submitAnswer(){
    const q = this.dialogQuestions[this.currentQ];
    if(this.selectedChoice === null) return; // require selection
    if(this.selectedChoice === q.correct){ this.score += 10 }
    // move to next
    this.selectedChoice = null;
    this.currentQ++;
    if(this.currentQ >= this.dialogQuestions.length){
      // dialog finished
      this.finishDialog();
    }
  }

  finishDialog(){
    if(this.currentButtonIndex !== null){
      this.completed[this.currentButtonIndex] = true;
    }
    this.dialogOpen = false;
    this.currentButtonIndex = null;
    this.dialogQuestions = [];
    this.currentQ = 0;
    this.selectedChoice = null;
  }

  get allCompleted(): boolean{ return this.completed.every(c => c) }

  goToMenu(){ this.router.navigate(['/']) }
}
