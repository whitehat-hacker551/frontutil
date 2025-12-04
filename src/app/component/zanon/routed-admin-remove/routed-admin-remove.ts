import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ZanonService } from '../../../service/zanon/zanon';
import { IZanon } from '../../../model/zanon/zanon';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'app-routed-admin-remove',
  imports: [UnroutedAdminView],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css'
})
export class RoutedAdminRemoveZanon implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ZanonService = inject(ZanonService);

  oZanon: IZanon | null = null;
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
    this.ZanonService.get(id).subscribe({
      next: (data: IZanon) => {
        this.oZanon = data;
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
    if (!this.oZanon) return;
    this.deleting = true;
    this.ZanonService.delete(this.oZanon.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/zanon/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el post';
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/zanon/plist']);
  }
}
