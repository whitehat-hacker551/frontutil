import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZanonService } from '../../../service/zanon/zanon';
import { IZanon } from '../../../model/zanon/zanon';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-routed-admin-edit',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class RoutedAdminEditZanon implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private ZanonService = inject(ZanonService);

    zanonForm!: FormGroup;
    zanonId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalZanon: IZanon | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.zanonId = +id;
            this.loadZanon(+id);
        } else {
            this.loading = false;
            this.error = 'ID de post no válido';
        }
    }

    initForm(): void {
        this.zanonForm = this.fb.group({
            titulo: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            contenido: ['', [
                Validators.required,
                Validators.minLength(10)]],
            etiquetas: ['', [Validators.maxLength(100)]],
            duracion: ['', [
                Validators.required,
                Validators.min(0),
            ]],
            dificultad: ['', [Validators.required]],
            publico: ['', [Validators.required]],
        });
    }

    loadZanon(id: number): void {
        this.ZanonService.get(id).subscribe({
            next: (zanon: IZanon) => {
                this.originalZanon = zanon;
                this.zanonForm.patchValue({
                    titulo: zanon.titulo,
                    contenido: zanon.contenido,
                    etiquetas: zanon.etiquetas,
                    duracion: zanon.duracion,
                    dificultad: zanon.dificultad,
                    publico: zanon.publico,
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
        if (!this.zanonForm.valid || !this.zanonId) {
            this.zanonForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<IZanon> = {
            id: this.zanonId!,
            titulo: this.zanonForm.value.titulo,
            contenido: this.zanonForm.value.contenido,
            etiquetas: this.zanonForm.value.etiquetas,
            duracion: this.zanonForm.value.duracion,
            dificultad: this.zanonForm.value.dificultad,
            publico: this.zanonForm.value.publico
        };

        this.ZanonService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/zanon/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar el post';
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
