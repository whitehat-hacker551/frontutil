import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../service/blog';
import { IBlog } from '../../../model/blog';
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
  private blogService = inject(BlogService);

  blogForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.blogForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1024)
      ]],
      contenido: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      etiquetas: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1024)
      ]],
    });
  }

  onSubmit(): void {
    if (!this.blogForm.valid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IBlog> = {
      titulo: this.blogForm.value.titulo,
      contenido: this.blogForm.value.contenido,
      etiquetas: this.blogForm.value.etiquetas,
    };

    this.blogService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/blog/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el post';
        console.error(err);
      },
    });
  }

  get titulo() {
    return this.blogForm.get('titulo');
  }

  get contenido() {
    return this.blogForm.get('contenido');
  }

  get etiquetas() {
    return this.blogForm.get('etiquetas');
  }
}
