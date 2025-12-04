import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PallasService } from '../../../service/pallasService';
import { IPallas } from '../../../model/pallas';
import { DatePipe } from '@angular/common'; 
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pallas-view',
  standalone: true, 
  imports: [
    RouterLink,  // Para que funcionen los botones de volver/editar
    DatePipe     // Para que funcione el formateo de fecha | date
  ],
  templateUrl: './pallas-view.html',
  styleUrl: './pallas-view.css',
})
export class PallasView implements OnInit {

  // INYECCIÓN DE DEPENDENCIAS
  private route = inject(ActivatedRoute);
  private oPallasService = inject(PallasService);
  

  // VARIABLES DE ESTADO
  id: number = 0;
  oPallas: IPallas | null = null;
  strResult: string = "";

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam) {
      this.id = +idParam;
      this.getOne();
    } else {
      this.strResult = "Error: No se ha proporcionado un ID válido.";
    }
  }

  getOne() {
    this.oPallasService.get(this.id).subscribe({
      next: (data: IPallas) => {
        this.oPallas = data;
      },
      error: (err: HttpErrorResponse) => {
        this.strResult = "Error al cargar los datos: " + err.message;
      }
    });
  }
}