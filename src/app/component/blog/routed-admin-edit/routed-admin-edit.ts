import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogService } from '../../../service/blog';
import { IBlog } from '../../../model/blog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-routed-admin-edit',
    imports: [ReactiveFormsModule, RouterLink, MatDialogModule, MatSnackBarModule],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class RoutedAdminEdit implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private blogService = inject(BlogService);
    private dialog = inject(MatDialog);
    private snackBar = inject(MatSnackBar);

    blogForm!: FormGroup;
    blogId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalBlog: IBlog | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.blogId = +id;
            this.loadBlog(+id);
        } else {
            this.loading = false;
            this.error = 'ID de post no válido';
        }
    }

    initForm(): void {
        this.blogForm = this.fb.group({
            titulo: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            contenido: ['', [
                Validators.required,
                Validators.minLength(10)]],
            etiquetas: ['', [Validators.maxLength(100)]],
            publicado: [false]
        });
    }

    loadBlog(id: number): void {
        this.blogService.get(id).subscribe({
            next: (blog: IBlog) => {
                this.originalBlog = blog;
                this.blogForm.patchValue({
                    titulo: blog.titulo,
                    contenido: blog.contenido,
                    etiquetas: blog.etiquetas,
                    publicado: blog.publicado,
                });
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = 'Error al cargar el post';
                this.loading = false;
                console.error(err);
            },
        });
    }

    onSubmit(): void {
        if (!this.blogForm.valid || !this.blogId) {
            this.blogForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<IBlog> = {
            id: this.blogId!,
            titulo: this.blogForm.value.titulo,
            contenido: this.blogForm.value.contenido,
            etiquetas: this.blogForm.value.etiquetas,
            publicado: this.blogForm.value.publicado
        };

        this.blogService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                                    // mark form as pristine so canDeactivate guard won't ask confirmation
                                    if (this.blogForm) {
                                            this.blogForm.markAsPristine();
                                    }
                                    // inform the user
                                    this.snackBar.open('Post guardado correctamente', 'Cerrar', { duration: 3000 });
                                    this.router.navigate(['/blog/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar el post';
                this.snackBar.open('Error al guardar el post', 'Cerrar', { duration: 4000 });
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
}
