import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalinescuService } from '../../../service/calinescu.service';
import { ICalinescu } from '../../../model/calinescu';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-new-calinescu',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './routed-admin-new.html',
  styleUrl: './routed-admin-new.css',
})
export class RoutedAdminNewCalinescu implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private calinescuService = inject(CalinescuService);

  calinescuForm!: FormGroup;
  error: string | null = null;
  submitting: boolean = false;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.calinescuForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255)
      ]],
      contenido: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      fechaCompraEsperada: [''],
      publicado: [true],
      precio: [0, [Validators.min(0)]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
    });
  }

  enviarFormulario(): void {
    if (!this.calinescuForm.valid) {
      this.calinescuForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    
    // Convertir fecha si existe
    let fechaFormateada: string | undefined = undefined;
    if (this.calinescuForm.value.fechaCompraEsperada) {
      const fecha = new Date(this.calinescuForm.value.fechaCompraEsperada);
      fechaFormateada = this.formatearFecha(fecha);
    }
    
    const payload: Partial<ICalinescu> = {
      nombre: this.calinescuForm.value.nombre,
      contenido: this.calinescuForm.value.contenido,
      fecha_compra_esperada: fechaFormateada,
      publicado: this.calinescuForm.value.publicado,
      precio: this.calinescuForm.value.precio || 0,
      cantidad: this.calinescuForm.value.cantidad || 1,
    };

    this.calinescuService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/calinescu/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.submitting = false;
        this.error = 'Error al crear el item';
        console.error(err);
      },
    });
  }

  formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  get nombre() {
    return this.calinescuForm.get('nombre');
  }

  get contenido() {
    return this.calinescuForm.get('contenido');
  }

  get fechaCompraEsperada() {
    return this.calinescuForm.get('fechaCompraEsperada');
  }

  get publicado() {
    return this.calinescuForm.get('publicado');
  }

  get precio() {
    return this.calinescuForm.get('precio');
  }

  get cantidad() {
    return this.calinescuForm.get('cantidad');
  }
}
