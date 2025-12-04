import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IPage } from '../../../model/plist';
import { IFernandezIdea } from '../../../model/fernandez-idea';
import { FernandezIdeaService } from '../../../service/fernandez-idea.service';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { FernandezUnroutedUserView } from "../unrouted-user-view/unrouted-user-view";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-fernandez-routed-user-plist',
  imports: [RouterLink, Paginacion, FernandezUnroutedUserView, BotoneraRpp],
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
})
export class FernandezRoutedUserPlist {
  private readonly oIdeaService = inject(FernandezIdeaService);
  
  oPage: IPage<IFernandezIdea> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  // Search / filter / sort
  searchTerm: string = '';
  categoriaFilter: string = 'ALL';
  orderField: string = 'fechaCreacion';
  orderDirection: string = 'desc';
  private searchTimer: any = null;

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    // Primera petición: obtener la página solicitada
  this.oIdeaService.getPage(this.numPage, this.numRpp, this.orderField, this.orderDirection, true, this.searchTerm, this.categoriaFilter).subscribe({
      next: (data: IPage<IFernandezIdea>) => {
        // Debug: log search term and incoming page size
        console.debug('User getPage - searchTerm:', this.searchTerm, 'received items:', data.content?.length);

        // If a search term is present, apply client-side filtering as a fallback
        if (this.searchTerm && this.searchTerm.trim() !== '') {
          const q = this.searchTerm.toLowerCase();
          // filter current page
          const filteredFirst = (data.content || []).filter(i => {
            const title = (i.titulo || '').toLowerCase();
            const desc = (i.comentario || '').toLowerCase();
            return title.includes(q) || desc.includes(q);
          });

          if (filteredFirst.length >= this.numRpp) {
            const result: IPage<IFernandezIdea> = {
              ...data,
              content: filteredFirst.slice(0, this.numRpp),
              // Preserve server totalElements so pagination reflects total matches when backend supports it
              totalPages: Math.max(1, Math.ceil((data.totalElements || 0) / this.numRpp)),
              totalElements: data.totalElements,
            };
            this.oPage = result;
          } else {
            // collect matches from subsequent pages until we have enough or run out
            const collected: IFernandezIdea[] = [...filteredFirst];
            const totalPages = data.totalPages;

            const fetchNext = (nextPage: number) => {
              if (collected.length >= this.numRpp || nextPage >= totalPages) {
                const result: IPage<IFernandezIdea> = {
                  ...data,
                  content: collected.slice(0, this.numRpp),
                  // Preserve server totalElements so pagination reflects total matches when backend supports it
                  totalPages: Math.max(1, Math.ceil((data.totalElements || 0) / this.numRpp)),
                  totalElements: data.totalElements,
                  size: data.size,
                  number: data.number,
                };
                this.oPage = result;
                // If requested page is out of range, adjust
                if (this.numPage > 0 && this.numPage >= data.totalPages) {
                  this.numPage = data.totalPages - 1;
                  this.getPage();
                }
                return;
              }
              this.oIdeaService.getPage(nextPage, this.numRpp, this.orderField, this.orderDirection, true, this.searchTerm, this.categoriaFilter).subscribe({
                next: (nextData: IPage<IFernandezIdea>) => {
                  const matches = (nextData.content || []).filter(i => {
                    const title = (i.titulo || '').toLowerCase();
                    const desc = (i.comentario || '').toLowerCase();
                    return title.includes(q) || desc.includes(q);
                  });
                  collected.push(...matches);
                  fetchNext(nextPage + 1);
                },
                error: (err: HttpErrorResponse) => {
                  console.error('Error fetching next page for public fill:', err);
                  const result: IPage<IFernandezIdea> = {
                    ...data,
                    content: collected.slice(0, this.numRpp),
                    totalPages: Math.max(1, Math.ceil((data.totalElements || 0) / this.numRpp)),
                    totalElements: data.totalElements,
                    size: data.size,
                    number: data.number,
                  };
                  this.oPage = result;
                },
              });
            };

            fetchNext(this.numPage + 1);
            // Kick off a background scan to compute exact total matches and update pagination accordingly
            this.scanAndUpdateTotals(data.totalPages, true).catch((err: unknown) => console.error('Error scanning totals (user):', err));
          }
        } else {
          // No search term: keep original behavior
          if (data.content.length >= this.numRpp) {
            this.oPage = data;
          } else {
            // Si no hay suficientes ideas públicas en esta página, intentamos cargar páginas siguientes
            const collected: IFernandezIdea[] = [...data.content];
            const totalPages = data.totalPages;

            const fetchNext = (nextPage: number) => {
              if (collected.length >= this.numRpp || nextPage >= totalPages) {
                // Ajustar el objeto paginado resultante
                const result: IPage<IFernandezIdea> = {
                  ...data,
                  content: collected.slice(0, this.numRpp),
                  totalPages: data.totalPages,
                  totalElements: data.totalElements,
                  size: data.size,
                  number: data.number,
                };
                this.oPage = result;
                // Si la página actual solicitada está fuera de rango, reajustar
                if (this.numPage > 0 && this.numPage >= data.totalPages) {
                  this.numPage = data.totalPages - 1;
                  this.getPage();
                }
                return;
              }
              // Solicitar la siguiente página y añadir sus ideas públicas
              this.oIdeaService.getPage(nextPage, this.numRpp, this.orderField, this.orderDirection, true, this.searchTerm, this.categoriaFilter).subscribe({
                next: (nextData: IPage<IFernandezIdea>) => {
                  collected.push(...nextData.content);
                  fetchNext(nextPage + 1);
                },
                error: (err: HttpErrorResponse) => {
                  console.error('Error fetching next page for public fill:', err);
                  // Devolver lo que tengamos hasta ahora
                  const result: IPage<IFernandezIdea> = {
                    ...data,
                    content: collected.slice(0, this.numRpp),
                    totalPages: data.totalPages,
                    totalElements: data.totalElements,
                    size: data.size,
                    number: data.number,
                  };
                  this.oPage = result;
                },
              });
            };

            // Iniciar la carga de páginas siguientes
            fetchNext(this.numPage + 1);
          }
        }

        // Si la página solicitada supera el total devuelto por el backend, movernos a la última disponible
        if (this.numPage > 0 && this.numPage >= data.totalPages) {
          this.numPage = data.totalPages - 1;
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  /**
   * Scan all pages (up to a cap) to compute total matching records for the active search.
   * Updates this.oPage.totalElements and this.oPage.totalPages so the paginator reflects real counts.
   */
  private async scanAndUpdateTotals(serverTotalPages: number, publico: boolean) {
    if (!this.searchTerm || this.searchTerm.trim() === '') return;
    const maxPagesToScan = Math.min(serverTotalPages || 0, 200); // safety cap
    if (maxPagesToScan <= 0) return;
    console.debug('scanAndUpdateTotals: scanning', maxPagesToScan, 'pages for term:', this.searchTerm);
    let totalMatches = 0;
    const q = this.searchTerm.toLowerCase();
    for (let p = 0; p < maxPagesToScan; p++) {
      try {
        const pageData = await firstValueFrom(this.oIdeaService.getPage(p, this.numRpp, this.orderField, this.orderDirection, publico, this.searchTerm, this.categoriaFilter));
        const matches = (pageData.content || []).filter(i => {
          const title = (i.titulo || '').toLowerCase();
          const desc = (i.comentario || '').toLowerCase();
          return title.includes(q) || desc.includes(q);
        }).length;
        totalMatches += matches;
      } catch (err) {
        console.error('scanAndUpdateTotals: error fetching page', p, err);
        break;
      }
    }
    // Update pagination totals based on scanned matches
    if (this.oPage) {
      this.oPage.totalElements = totalMatches;
      this.oPage.totalPages = Math.max(1, Math.ceil(totalMatches / this.numRpp));
      console.debug('scanAndUpdateTotals: totalMatches=', totalMatches, 'totalPages=', this.oPage.totalPages);
    }
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

  onSearch(term: string) {
    this.searchTerm = term ? term.trim() : '';
    this.numPage = 0;
    // debounce to avoid spamming requests while typing
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.getPage();
    }, 350);
    return false;
  }

  /**
   * Execute search immediately (used for Enter key)
   */
  onSearchImmediate(term: string) {
    this.searchTerm = term ? term.trim() : '';
    this.numPage = 0;
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    this.getPage();
    return false;
  }

  onCategoriaChange(cat: string) {
    this.categoriaFilter = cat || 'ALL';
    this.numPage = 0;
    this.getPage();
    return false;
  }

  onOrderChange(field: string) {
    this.orderField = field || 'fechaCreacion';
    this.numPage = 0;
    this.getPage();
    return false;
  }

  toggleDirection() {
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.numPage = 0;
    this.getPage();
    return false;
  }
}
