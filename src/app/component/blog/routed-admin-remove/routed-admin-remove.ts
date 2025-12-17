import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../../service/blog';
import { IBlog } from '../../../model/blog';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedAdminView } from "../unrouted-admin-view/unrouted-admin-view";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-routed-admin-remove',
  imports: [UnroutedAdminView, MatSnackBarModule],
  templateUrl: './routed-admin-remove.html',
  styleUrl: './routed-admin-remove.css'
})
export class RoutedAdminRemove implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private snackBar = inject(MatSnackBar);

  oBlog: IBlog | null = null;
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
    this.blogService.get(id).subscribe({
      next: (data: IBlog) => {
        this.oBlog = data;
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
    if (!this.oBlog) return;
    this.deleting = true;
    this.blogService.delete(this.oBlog.id).subscribe({
      next: () => {
        this.deleting = false;
        this.snackBar.open('Post borrado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/blog/plist']);
      },
      error: (err: HttpErrorResponse) => {
        this.deleting = false;
        this.error = 'Error borrando el post';
        this.snackBar.open('Error al borrar el post', 'Cerrar', { duration: 4000 });
        console.error(err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/blog/plist']);
  }
}
