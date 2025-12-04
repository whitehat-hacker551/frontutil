import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZanonService } from '../../../service/zanon/zanon';
import { IZanon } from '../../../model/zanon/zanon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNewZanon implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ZanonService = inject(ZanonService);

  zanonForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.zanonForm = this.fb.group({
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
      duracion: ['', [
        Validators.required,
        Validators.min(0),
      ]],
      dificultad: ['', [Validators.required]],
      publico: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (!this.zanonForm.valid) {
      this.zanonForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IZanon> = {
      titulo: this.zanonForm.value.titulo,
      contenido: this.zanonForm.value.contenido,
      etiquetas: this.zanonForm.value.etiquetas,
      duracion: this.zanonForm.value.duracion,
      dificultad: this.zanonForm.value.dificultad,
      publico: this.zanonForm.value.publico,
    };

    this.ZanonService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/zanon/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el post';
        console.error(err);
      },
    });
  }

  get titulo() {
    return this.zanonForm.get('titulo');
  }

  get contenido() {
    return this.zanonForm.get('contenido');
  }

  get etiquetas() {
    return this.zanonForm.get('etiquetas');
  }

  get duracion() {
    return this.zanonForm.get('duracion');
  }

  get dificultad() {
    return this.zanonForm.get('dificultad');
  }

  get publico() {
    return this.zanonForm.get('publico');
  }
}
