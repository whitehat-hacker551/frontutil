import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FernandezIdeaService } from '../../../service/fernandez-idea.service';
import { IFernandezIdea } from '../../../model/fernandez-idea';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-fernandez-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class FernandezRoutedAdminNew implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly ideaService = inject(FernandezIdeaService);

  ideaForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.ideaForm = this.fb.group({
      titulo: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      comentario: ['', [
        Validators.required,
        Validators.minLength(1),
      ]],
      categoria: ['IDEA', [Validators.required]],
      publico: [true, [Validators.required]],
    });
  }

  onSubmit(): void {
    if (!this.ideaForm.valid) {
      this.ideaForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IFernandezIdea> = {
      titulo: this.ideaForm.value.titulo,
      comentario: this.ideaForm.value.comentario,
      categoria: this.ideaForm.value.categoria,
      publico: this.ideaForm.value.publico,
    };

    this.ideaService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/fernandez-idea/admin/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear la idea';
        console.error(err);
      },
    });
  }

  get titulo() {
    return this.ideaForm.get('titulo');
  }

  get comentario() {
    return this.ideaForm.get('comentario');
  }

  get categoria() {
    return this.ideaForm.get('categoria');
  }

  get publico() {
    return this.ideaForm.get('publico');
  }
}
