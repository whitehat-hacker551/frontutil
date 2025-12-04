import { Component, inject, OnInit } from '@angular/core';
import { PallasService } from '../../../service/pallasService';
import { IPallas } from '../../../model/pallas';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pallas-remove',
  imports: [DatePipe],
  templateUrl: './pallas-remove.html',
  styleUrl: './pallas-remove.css',
})
export class PallasRemove implements OnInit {


  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private oPallasService = inject(PallasService);


  id: number = 0;
  oPallas: IPallas | null = null;
  
  loading: boolean = true;   
  deleting: boolean = false; 
  error: string | null = null;

  ngOnInit(): void {
    // Obtenemos el ID de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = "ID no válido";
      this.loading = false;
      return;
    }
    this.id = +idParam; 
    this.load(this.id);
  }

  load(id: number) {
    this.oPallasService.get(id).subscribe({
      next: (data: IPallas) => {
        this.oPallas = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando la nota: ' + err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.oPallas) return;
    
    this.deleting = true; // Bloqueamos el botón
    
    this.oPallasService.delete(this.oPallas.id).subscribe({
      next: () => {
        this.deleting = false;
        // Navegamos de vuelta a la lista
        this.router.navigate(['/pallas/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando la nota: ' + err.message;
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/pallas/plist']);
  }
}
