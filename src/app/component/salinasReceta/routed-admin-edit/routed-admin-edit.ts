import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SalinasService } from '../../../service/salinas-receta';
import { ISalinasReceta } from '../../../model/salinas-receta';

@Component({
    selector: 'app-salinas-routed-admin-edit',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class SalinasRoutedAdminEdit implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private SalinasService = inject(SalinasService);

    salinasRecetaForm!: FormGroup;
    salinasRecetaId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.salinasRecetaId = +id;
            this.loadReceta(+id);
        } else {
            this.loading = false;
            this.error = 'ID de Receta no válido';
        }
    }

    initForm(): void {
        this.salinasRecetaForm = this.fb.group({
            nombre: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            ingredientes: ['', [Validators.maxLength(10000)]],
            preparacion: ['', [
                Validators.required,
                Validators.minLength(10)]],
        });
    }

    loadReceta(id: number): void {
        this.SalinasService.get(id).subscribe({
            next: (salinasReceta: ISalinasReceta) => {
                this.salinasRecetaForm.patchValue({
                    nombre: salinasReceta.nombre,
                    ingredientes: salinasReceta.ingredientes,
                    preparacion: salinasReceta.preparacion,
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
        if (!this.salinasRecetaForm.valid || !this.salinasRecetaId) {
            this.salinasRecetaForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<ISalinasReceta> = {
            id: this.salinasRecetaId!,
            nombre: this.salinasRecetaForm.value.nombre,
            ingredientes: this.salinasRecetaForm.value.ingredientes,
            preparacion: this.salinasRecetaForm.value.preparacion
        };

        this.SalinasService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/receta/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar la receta';
                console.error(err);
            },
        });
    }

    get nombre() {
        return this.salinasRecetaForm.get('nombre');
    }

    get preparacion() {
        return this.salinasRecetaForm.get('preparacion');
    }

    get ingredientes() {
        return this.salinasRecetaForm.get('ingredientes');
    }
}
