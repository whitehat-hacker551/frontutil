import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CastanyeraService } from '../../../service/castanyera';
import { ICastanyera } from '../../../model/castanyera';
import { HttpErrorResponse } from '@angular/common/http';
import { CastanyeraUnroutedAdminView } from "../castanyera-unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'castanyera-app-routed-admin-remove',
  imports: [CastanyeraUnroutedAdminView],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css'
})
export class CastanyeraRoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private castanyeraService = inject(CastanyeraService);

  oCastanyera: ICastanyera | null = null;
  loading: boolean = true;
  error: string | null = null;
  deleting: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }
    this.load(+id);
  }

  load(id: number) {
    this.castanyeraService.get(id).subscribe({
      next: (data: ICastanyera) => {
        this.oCastanyera = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando el post';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.oCastanyera) return;
    this.deleting = true;
    this.castanyeraService.delete(this.oCastanyera.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/castanyera/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el post';
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/castanyera/plist']);
  }
}
