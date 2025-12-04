import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablonService } from '../../service/tablon';
import { ITablon } from '../../model/tablon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-routed-admin-edit',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class RoutedAdminEdit implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private tablonService = inject(TablonService);

    tablonForm!: FormGroup;
    tablonId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalTablon: ITablon | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.tablonId = +id;
            this.loadTablon(+id);
        } else {
            this.loading = false;
            this.error = 'ID de post no válido';
        }
    }

    initForm(): void {
        this.tablonForm = this.fb.group({
            titulo: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            contenido: ['', [
                Validators.required,
                Validators.minLength(10)]],
            etiquetas: ['', [Validators.maxLength(100)]],
            publico: [false],
        });
    }

    loadTablon(id: number): void {
        this.tablonService.get(id).subscribe({
            next: (tablon: ITablon) => {
                this.originalTablon = tablon;
                this.tablonForm.patchValue({
                    titulo: tablon.titulo,
                    contenido: tablon.contenido,
                    etiquetas: tablon.etiquetas,
                    publico: tablon.publico,
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
        if (!this.tablonForm.valid || !this.tablonId) {
            this.tablonForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<ITablon> = {
            id: this.tablonId!,
            titulo: this.tablonForm.value.titulo,
            contenido: this.tablonForm.value.contenido,
            etiquetas: this.tablonForm.value.etiquetas,
            publico: this.tablonForm.value.publico
        };

        this.tablonService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/tablon/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar el post';
                console.error(err);
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
