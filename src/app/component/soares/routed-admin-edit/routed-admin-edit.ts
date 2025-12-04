// Componente que permite al administrador editar una pregunta y guardar los cambios
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SoaresService } from '../../../service/soares';
import { ISoares } from '../../../model/soares';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-edit',
  templateUrl: './routed-admin-edit.html',
  styleUrl: './routed-admin-edit.css',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
})
export class SoaresRoutedAdminEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private soaresService = inject(SoaresService);

  soaresForm!: FormGroup;
  id: number = 0;
  error: string | null = null;

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.soaresService.getOne(this.id).subscribe({
      next: (oSoares: ISoares) => {
        this.soaresForm = this.fb.group({
          id: [oSoares.id],
          preguntas: [oSoares.preguntas, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
          publicacion: [oSoares.publicacion, Validators.required],
          fechaCreacion: [oSoares.fechaCreacion],
          fechaModificacion: [oSoares.fechaModificacion],
        });
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'Error al cargar la pregunta.';
        console.log(err);
      }
    });
  }

  onSubmit() {
    if (this.soaresForm.valid) {
      const oSoares: ISoares = this.soaresForm.value as ISoares;

      this.soaresService.updateOne(oSoares).subscribe({
        next: (oSoaresUpdated: ISoares) => {
          this.router.navigate(['/soares/admin/plist']); // Redirigir al listado después de editar
        },
        error: (err: HttpErrorResponse) => {
          this.error = err.error.message || 'Error al actualizar la pregunta.';
          console.log(err);
        }
      });
    }
  }
}
