import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CastanyeraService } from '../../../service/castanyera';
import { ICastanyera } from '../../../model/castanyera';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'castanyera-app-routed-admin-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-edit.html',
  styleUrl: './routed-admin-edit.css',
})
export class CastanyeraRoutedAdminEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private castanyeraService = inject(CastanyeraService);

  castanyeraForm!: FormGroup;
  castanyeraId: number | null = null;
  loading: boolean = true;
  error: string | null = null;
  submitting: boolean = false;
  private originalCastanyera: ICastanyera | null = null;

  ngOnInit(): void {
    this.initForm();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.castanyeraId = +id;
      this.loadCastanyera(+id);
    } else {
      this.loading = false;
      this.error = 'ID de post no válido';
    }
  }

  initForm(): void {
    this.castanyeraForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      contenido: ['', [Validators.required, Validators.minLength(10)]],
      etiquetas: ['', [Validators.maxLength(100)]],
      publico: [false],
    });
  }

  loadCastanyera(id: number): void {
    this.castanyeraService.get(id).subscribe({
      next: (castanyera: ICastanyera) => {
        this.originalCastanyera = castanyera;
        this.castanyeraForm.patchValue({
          titulo: castanyera.titulo,
          contenido: castanyera.contenido,
          etiquetas: castanyera.etiquetas,
          publico: castanyera.publico ?? false,
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
    if (!this.castanyeraForm.valid || !this.castanyeraId) {
      this.castanyeraForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<ICastanyera> = {
      id: this.castanyeraId!,
      titulo: this.castanyeraForm.value.titulo,
      contenido: this.castanyeraForm.value.contenido,
      etiquetas: this.castanyeraForm.value.etiquetas,
      publico: this.castanyeraForm.value.publico,
    };

    this.castanyeraService.update(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/castanyera/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al guardar el post';
        console.error(err);
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
