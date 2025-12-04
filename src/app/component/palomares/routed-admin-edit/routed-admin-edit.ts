import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PalomaresService } from '../../../service/palomares';
import { IPalomares } from '../../../model/palomares';
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
    private palomaresService = inject(PalomaresService);

    palomaresForm!: FormGroup;
    palomaresId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalPalomares: IPalomares | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.palomaresId = +id;
            this.loadPalomares(+id);
        } else {
            this.loading = false;
            this.error = 'ID de tarea no válido';
        }
    }

    initForm(): void {
        this.palomaresForm = this.fb.group({
            titulo: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            descripcion: ['', [
                Validators.required,
                Validators.minLength(3)]],
            categoria: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)]],
            completada: [false],
            publicado: [false]
        });
    }

    loadPalomares(id: number): void {
        this.palomaresService.get(id).subscribe({
            next: (palomares: IPalomares) => {
                this.originalPalomares = palomares;
                this.palomaresForm.patchValue({
                    titulo: palomares.titulo,
                    descripcion: palomares.descripcion,
                    categoria: palomares.categoria,
                    completada: palomares.completada,
                    publicado: palomares.publicado
                });
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = 'Error al cargar la tarea';
                this.loading = false;
                console.error(err);
            },
        });
    }

    onSubmit(): void {
        if (!this.palomaresForm.valid || !this.palomaresId) {
            this.palomaresForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<IPalomares> = {
            id: this.palomaresId!,
            titulo: this.palomaresForm.value.titulo,
            descripcion: this.palomaresForm.value.descripcion,
            categoria: this.palomaresForm.value.categoria,
            completada: this.palomaresForm.value.completada,
            publicado: this.palomaresForm.value.publicado
        };

        this.palomaresService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/palomares/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar la tarea';
                console.error(err);
            },
        });
    }

    get titulo() {
        return this.palomaresForm.get('titulo');
    }

    get descripcion() {
        return this.palomaresForm.get('descripcion');
    }

    get categoria() {
        return this.palomaresForm.get('categoria');
    }

    get completada() {
        return this.palomaresForm.get('completada');
    }

    get publicado() {
        return this.palomaresForm.get('publicado');
    }
}
