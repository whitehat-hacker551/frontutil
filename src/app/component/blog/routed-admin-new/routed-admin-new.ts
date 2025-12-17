import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../service/blog';
import { IBlog } from '../../../model/blog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink, MatDialogModule, MatSnackBarModule],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
      publicado: [false]
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
      publicado: this.blogForm.value.publicado,
    };

    this.blogService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        // mark form as pristine so canDeactivate guard won't ask confirmation
        if (this.blogForm) {
          this.blogForm.markAsPristine();
        }
        // inform the user
        this.snackBar.open('Post creado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/blog/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el post';
        this.snackBar.open('Error al crear el post', 'Cerrar', { duration: 4000 });
        console.error(err);
      },
    });
  }

  // Guard: ask confirmation if the form has unsaved changes
  canDeactivate(): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {
    if (!this.blogForm || !this.blogForm.dirty) {
      return true;
    }
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cambios sin guardar',
        message: 'Hay cambios sin guardar. ¿Desea salir sin guardar los cambios?'
      }
    });
    return ref.afterClosed();
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

  get publicado() {
    return this.blogForm.get('publicado');
  }
}
