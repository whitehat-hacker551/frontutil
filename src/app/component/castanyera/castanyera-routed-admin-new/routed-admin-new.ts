import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CastanyeraService } from '../../../service/castanyera';
import { ICastanyera } from '../../../model/castanyera';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'castanyera-app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class CastanyeraRoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private castanyeraService = inject(CastanyeraService);

  castanyeraForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.castanyeraForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1024)]],
      contenido: ['', [Validators.required, Validators.minLength(3)]],
      etiquetas: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1024)]],
      publico: [false],
    });
  }

  onSubmit(): void {
    if (!this.castanyeraForm.valid) {
      this.castanyeraForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<ICastanyera> = {
      titulo: this.castanyeraForm.value.titulo,
      contenido: this.castanyeraForm.value.contenido,
      etiquetas: this.castanyeraForm.value.etiquetas,
      publico: this.castanyeraForm.value.publico,
    };

    this.castanyeraService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/castanyera/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        // Si status === 0 normalmente significa que no se pudo conectar con el backend
        if (err.status === 0) {
          this.error = `No se pudo conectar con el backend en ${
            err.url ?? 'http://localhost:8089'
          }. Comprueba que está en ejecución.`;
          console.error('Backend connection refused:', err);
          return;
        }

        // Mostrar mensaje devuelto por el servidor si existe, sino un mensaje genérico
        const serverMsg =
          err.error && (err.error.message || err.error)
            ? err.error.message ?? JSON.stringify(err.error)
            : null;
        this.error = serverMsg ? `Error al crear el post: ${serverMsg}` : 'Error al crear el post';
        console.error('Create post error:', err);
      },
    });
  }

  get titulo() {
    return this.castanyeraForm.get('titulo');
  }

  get contenido() {
    return this.castanyeraForm.get('contenido');
  }

  get etiquetas() {
    return this.castanyeraForm.get('etiquetas');
  }
}
