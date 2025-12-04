// Componente que permite al administrador eliminar una pregunta y muestra mensajes de error si ocurre algún problema
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoaresService } from '../../../service/soares';
import { ISoares } from '../../../model/soares';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-routed-admin-remove',
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css',
  imports: [RouterLink, CommonModule],
})
export class SoaresRoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private soaresService = inject(SoaresService);

  oSoares: ISoares | null = null;
  id: number = 0;
  error: string | null = null;

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.soaresService.getOne(this.id).subscribe({
      next: (oSoares: ISoares) => {
        this.oSoares = oSoares;
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'Error al cargar la pregunta.';
        console.log(err);
      }
    });
  }

  remove() {
    this.soaresService.removeOne(this.id).subscribe({
      next: (id: number) => {
        this.router.navigate(['/soares/admin/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error.message || 'Error al eliminar la pregunta.';
        console.log(err);
      }
    });
  }
}
