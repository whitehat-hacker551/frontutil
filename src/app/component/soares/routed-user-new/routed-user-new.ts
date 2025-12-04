// Componente que permite al usuario crear una nueva pregunta y muestra mensajes de éxito o error
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SoaresService } from '../../../service/soares';
import { ISoares } from '../../../model/soares';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-user-new',
  templateUrl: './routed-user-new.html',
  styleUrl: './routed-user-new.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SoaresRoutedUserNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private soaresService = inject(SoaresService);

  soaresForm!: FormGroup;
  error: string | null = null;
  success: boolean = false;

  ngOnInit(): void {
    this.soaresForm = this.fb.group({
      preguntas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    });
  }

  onSubmit() {
    if (this.soaresForm.valid) {
      const oSoares: ISoares = {
        id: 0,
        preguntas: this.soaresForm.value.preguntas,
        publicacion: false,
        fechaCreacion: '',
        fechaModificacion: '',
        aprobacion: false,
      };
      this.soaresService.createOne(oSoares).subscribe({
        next: (id: number) => {
          this.success = true;
          this.soaresForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error.message || 'Error al crear la pregunta.';
          console.log(err);
        }
      });
    }
  }
}
