import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PallasService } from '../../../service/pallasService';
import { IPallas } from '../../../model/pallas';

@Component({
  selector: 'app-pallas-new',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './pallas-new.html',
  styleUrls: ['./pallas-new.css'],
  standalone: true
})
export class PallasNew implements OnInit {

  oForm: FormGroup; // El objeto que controla el formulario
  strResult: string = ""; // Para mensajes de error o éxito

  constructor(
    private oFormBuilder: FormBuilder, // Ayuda a construir el form
    private oRouter: Router,           // Para navegar al Plist después de guardar
    private oPallasService: PallasService 
  ) { 
    // Inicializamos el formulario vacío
    this.oForm = <FormGroup>this.oFormBuilder.group({
      id: [''],
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      contenido: ['', [Validators.required, Validators.minLength(5)]],
      publicado: [false], 
    });
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.oForm.valid) {

      this.oPallasService.create(this.oForm.value).subscribe({
        next: (id: number) => {
          
          this.strResult = "¡Nota guardada con éxito! ID: " + id;
          // Esperamos 1 segundo y volvemos al listado
          setTimeout(() => {
            this.oRouter.navigate(['/pallas/plist']);
          }, 1500);
        },
        error: (err) => {
          this.strResult = "Error al guardar: " + err.error.message;
        }
      });
    } else {
      this.strResult = "Por favor, revisa los errores en el formulario.";
    }
  }

}
