import { Component, inject } from '@angular/core';
import { IFernandezIdea } from '../../../model/fernandez-idea';
import { FernandezIdeaService } from '../../../service/fernandez-idea.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { Paginacion } from '../../shared/paginacion/paginacion';
import { BotoneraRpp } from '../../shared/botonera-rpp/botonera-rpp';


@Component({
  selector: 'app-fernandez-routed-user-view',
  imports: [RouterLink, Paginacion, BotoneraRpp],
  templateUrl: './routed-user-view.html',
  styleUrls: ['./routed-user-view.css'],
})
export class FernandezRoutedUserView {
  private readonly oIdeaService = inject(FernandezIdeaService);
  private readonly route = inject(ActivatedRoute);

  oIdea: IFernandezIdea | null = null;
  loading: boolean = true;
  error: string | null = null;

  oPage: IPage<IFernandezIdea> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  rppOptions: number[] = [5, 10, 20, 50, 100];
  ideaId: number = NaN;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.ideaId = idParam ? Number(idParam) : NaN;
    if (isNaN(this.ideaId)) {
      console.error('Invalid idea id:', idParam);
      this.error = 'ID de idea inválido';
      this.loading = false;
      return;
    }
    this.getPage();
  }

  ngOnInit() { }

  getPage() {
    this.loading = true;
    // Obtener el detalle de la idea por id, solo si es pública
    this.oIdeaService.get(this.ideaId).subscribe({
      next: (idea: IFernandezIdea) => {
        if (idea.publico) {
          this.oIdea = idea;
          this.error = null;
        } else {
          this.oIdea = null;
          this.error = 'Esta idea no es pública.';
        }
        this.loading = false;
      },
      error: () => {
        this.oIdea = null;
        this.error = 'No se pudo cargar la idea.';
        this.loading = false;
      }
    });
    // Cargar la página para la navegación y paginación, solo ideas públicas
  this.oIdeaService.getPage(this.numPage, this.numRpp, 'fechaCreacion', 'desc', true).subscribe({
      next: (data: IPage<IFernandezIdea>) => {
        // Elimina cualquier idea privada por seguridad (aunque el backend ya filtra)
        data.content = data.content.filter(idea => idea.publico);
        this.oPage = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching page:', error);
      },
    });
  }

  goToPage(numPage: number) {
    this.numPage = numPage;
    this.getPage();
    return false;
  }

  onRppChange(n: number) {
    this.numRpp = n;
    this.getPage();
    return false;
  }

  goToIdea(id: number) {
    // Navega a la idea seleccionada usando el router
    location.assign(`/fernandez-idea/user/view/${id}`);
  }
}
