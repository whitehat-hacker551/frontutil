import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SemperteguiService } from '../../../service/sempertegui/semperteguiService';
import { IPelicula } from '../../../model/sempertegui/semperteguiInterface';

@Component({
  selector: 'app-sempertegui-routed-admin-new',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sempertegui-routed-admin-new.html',
  styleUrl: './sempertegui-routed-admin-new.css',
})
export class SemperteguiRoutedAdminNew implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private semperteguiService = inject(SemperteguiService);

  movieForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.movieForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      genero: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      director: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      puntuacion: [50, [
        Validators.min(0),
        Validators.max(100)
      ]],
      anyo: [null, [
        Validators.required,
        Validators.min(1901),
        Validators.max(2155),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  onSubmit(): void {
    if (!this.movieForm.valid) {
      this.movieForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    const payload: Partial<IPelicula> = {
      nombre: this.movieForm.value.nombre,
      genero: this.movieForm.value.genero,
      director: this.movieForm.value.director,
      puntuacion: Number(this.movieForm.value.puntuacion),
      anyo: Number(this.movieForm.value.anyo),
    };

    this.semperteguiService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/sempertegui/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al añadir un post de película';
        console.error(err);
      },
    });
  }

  get nombre() {
    return this.movieForm.get('nombre');
  }

  get genero() {
    return this.movieForm.get('genero');
  }

  get director() {
    return this.movieForm.get('director');
  }

  get puntuacion() {
      return this.movieForm.get('puntuacion');
  }
  
  get anyo() {
    return this.movieForm.get('anyo');
  }
}
