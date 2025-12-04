import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SalinasService } from '../../../service/salinas-receta';
import { ISalinasReceta } from '../../../model/salinas-receta';

@Component({
  selector: 'app-salinas-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class SalinasRoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private salinasService = inject(SalinasService);

  salinasRecetaForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.salinasRecetaForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1024)
      ]],
      ingredientes: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(1024)
      ]],
      preparacion: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      
    });
  }

  onSubmit(): void {
    if (!this.salinasRecetaForm.valid) {
      this.salinasRecetaForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<ISalinasReceta> = {
      nombre: this.salinasRecetaForm.value.nombre,
      ingredientes: this.salinasRecetaForm.value.ingredientes,
      preparacion: this.salinasRecetaForm.value.preparacion,
    };

    this.salinasService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/receta/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la receta';
        console.error(err);
      },
    });
  }

  get nombre() {
    return this.salinasRecetaForm.get('nombre');
  }

  get ingredientes() {
    return this.salinasRecetaForm.get('ingredientes');
  }

  get preparacion() {
    return this.salinasRecetaForm.get('preparacion');
  }

 
}
