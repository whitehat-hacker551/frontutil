import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PallasService } from '../../../service/pallasService';
import { IPallas } from '../../../model/pallas';



@Component({
  selector: 'app-pallas-update',
  templateUrl: './pallas-update.html',
  styleUrls: ['./pallas-update.css'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink] 
})
export class PallasUpdate implements OnInit {

  // INYECCIONES
  private oActivatedRoute = inject(ActivatedRoute);
  private oRouter = inject(Router);
  private oFormBuilder = inject(FormBuilder);
  private oPallasService = inject(PallasService);

  // VARIABLES
  id: number = 0;
  oForm: FormGroup;
  strResult: string = "";

  constructor() {

    this.oForm = this.oFormBuilder.group({
      id: [''], 
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      contenido: ['', [Validators.required, Validators.minLength(5)]],
      fechaCreacion: [''],
      fechaModificacion: [''],
      publicado: [false],
    });
  }

  ngOnInit(): void {

    this.id = this.oActivatedRoute.snapshot.params['id'];

    this.getOne();
  }

  getOne() {
    this.oPallasService.get(this.id).subscribe({
      next: (data: IPallas) => {
  
        this.oForm.patchValue(data);
      },
      error: (err: HttpErrorResponse) => {
        this.strResult = "Error al cargar los datos: " + err.message;
      }
    });
  }

  onSubmit() {
    if (this.oForm.valid) {
      
      this.oPallasService.update(this.oForm.value).subscribe({
        next: (result: number) => {
          this.strResult = "¡Nota actualizada con éxito!";
        
          
         this.oRouter.navigate(['/pallas/plist']);
          
        },
        error: (err: HttpErrorResponse) => {
          this.strResult = "Error al guardar: " + err.message;
        }
      });
    } else {
      this.strResult = "Por favor, revisa el formulario.";
    }
  }
}