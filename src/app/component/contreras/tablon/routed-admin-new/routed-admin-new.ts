import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablonService } from '../../service/tablon';
import { ITablon } from '../../model/tablon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tablonService = inject(TablonService);

  tablonForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.tablonForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(200)
      ]],
      contenido: ['', [
        Validators.required,
        Validators.minLength(10),
      ]],
      etiquetas: ['', [
        Validators.maxLength(100)
      ]],
      publico: [false],
    });
  }

  onSubmit(): void {
    if (!this.tablonForm.valid) {
      this.tablonForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<ITablon> = {
      titulo: this.tablonForm.value.titulo,
      contenido: this.tablonForm.value.contenido,
      etiquetas: this.tablonForm.value.etiquetas,
      publico: this.tablonForm.value.publico,
    };

    this.tablonService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/tablon/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = `Error al crear el post: ${err.message}`;
        console.error('Error completo:', err);
        console.error('Payload enviado:', payload);
      },
    });
  }

  get titulo() {
    return this.tablonForm.get('titulo');
  }

  get contenido() {
    return this.tablonForm.get('contenido');
  }

  get etiquetas() {
    return this.tablonForm.get('etiquetas');
  }

  get publico() {
    return this.tablonForm.get('publico');
  }
}
