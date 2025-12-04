import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PalomaresService } from '../../../service/palomares';
import { IPalomares } from '../../../model/palomares';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";

@Component({
  selector: 'app-routed-admin-remove',
  imports: [UnroutedAdminView],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css'
})
export class RoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private palomaresService = inject(PalomaresService);

  oPalomares: IPalomares | null = null;
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
    this.palomaresService.get(id).subscribe({
      next: (data: IPalomares) => {
        this.oPalomares = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Error cargando la tarea';
        this.loading = false;
        console.error(err);
      }
    });
  }

  confirmDelete() {
    if (!this.oPalomares) return;
    this.deleting = true;
    this.palomaresService.delete(this.oPalomares.id).subscribe({
      next: () => {
        this.deleting = false;
        this.router.navigate(['/palomares/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando la tarea';
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/palomares/plist']);
  }
}
