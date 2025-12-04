import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { IFernandezIdea } from '../../../model/fernandez-idea';
import { FernandezIdeaService } from '../../../service/fernandez-idea.service';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-fernandez-routed-admin-plist',
  imports: [RouterLink, Paginacion, BotoneraRpp],
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
})
export class FernandezRoutedAdminPlist {
  private readonly oIdeaService = inject(FernandezIdeaService);
  
  oPage: IPage<IFernandezIdea> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  // Search / filter / sort for admin (admin can see all)
  searchTerm: string = '';
  categoriaFilter: string = 'ALL';
  orderField: string = 'fechaCreacion';
  orderDirection: string = 'desc';
  private searchTimer: any = null;
  // Bulk creation UI state
  showBulkWarning: boolean = false;
  pendingBulkAmount: number | null = null;
  // Loading indicator for bulk creation
  isBulkLoading: boolean = false;

  ngOnInit() {
    this.getPage();
  }

  /**
   * Scan all pages (up to a cap) to compute total matching records for the active search (admin view).
   */
  private async scanAndUpdateTotals(serverTotalPages: number | undefined, publico: boolean | undefined) {
    if (!this.searchTerm || this.searchTerm.trim() === '') return;
    const totalPagesToScan = Math.min((serverTotalPages && serverTotalPages > 0) ? serverTotalPages : 200, 500);
    if (totalPagesToScan <= 0) return;
    console.debug('Admin scanAndUpdateTotals: scanning', totalPagesToScan, 'pages for term:', this.searchTerm);
    let totalMatches = 0;
    const q = this.searchTerm.toLowerCase();
    for (let p = 0; p < totalPagesToScan; p++) {
      try {
        const pageData = await firstValueFrom(this.oIdeaService.getPage(p, this.numRpp, this.orderField, this.orderDirection, publico, this.searchTerm, this.categoriaFilter));
        const matches = (pageData.content || []).filter(i => {
          const title = (i.titulo || '').toLowerCase();
          const desc = (i.comentario || '').toLowerCase();
          return title.includes(q) || desc.includes(q);
        }).length;
        totalMatches += matches;
      } catch (err: unknown) {
        console.error('Admin scanAndUpdateTotals: error fetching page', p, err);
        break;
      }
    }
    if (this.oPage) {
      this.oPage.totalElements = totalMatches;
      this.oPage.totalPages = Math.max(1, Math.ceil(totalMatches / this.numRpp));
      console.debug('Admin scanAndUpdateTotals: totalMatches=', totalMatches, 'totalPages=', this.oPage.totalPages);
    }
  }

  getPage() {
  this.oIdeaService.getPage(this.numPage, this.numRpp, this.orderField, this.orderDirection, undefined, this.searchTerm, this.categoriaFilter).subscribe({
      next: (data: IPage<IFernandezIdea>) => {
        // Debug: log search term and incoming page size
        console.debug('Admin getPage - searchTerm:', this.searchTerm, 'received items:', data.content?.length);
        // If there is an active search term, collect ALL matching records across pages (up to a cap)
        if (this.searchTerm && this.searchTerm.trim() !== '') {
          (async () => {
            try {
              const matches = await this.collectAllMatches(data.totalPages, undefined);
              const totalMatches = matches.length;
              const totalPages = Math.max(1, Math.ceil(totalMatches / this.numRpp));
              const start = this.numPage * this.numRpp;
              const pageSlice = matches.slice(start, start + this.numRpp);
              const result: IPage<IFernandezIdea> = {
                ...data,
                content: pageSlice,
                totalElements: totalMatches,
                totalPages: totalPages,
                size: this.numRpp,
                number: this.numPage,
              };
              this.oPage = result;
            } catch (err) {
              console.error('Error collecting matches for admin search:', err);
              // fallback: show server page (possibly filtered)
              this.oPage = data;
            }
          })();
        } else {
          this.oPage = data;
        }
        // si estamos en una página que supera el límite entonces nos situamos en la ultima disponible
        // If the currently requested page index is out of range relative to the current pagination totals,
        // adjust to the last available page. Use the oPage totals if available (they may be updated by the async collector).
        const currentTotalPages = this.oPage?.totalPages ?? data.totalPages;
        if (this.numPage > 0 && this.numPage >= currentTotalPages) {
          this.numPage = Math.max(0, currentTotalPages - 1);
          this.getPage();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  /**
   * Collect all matching records for the current searchTerm by scanning pages sequentially.
   * Returns an array of matching IFernandezIdea. Uses a safe page cap to avoid overload.
   */
  private async collectAllMatches(serverTotalPages: number | undefined, publico: boolean | undefined): Promise<IFernandezIdea[]> {
    const matches: IFernandezIdea[] = [];
    if (!this.searchTerm || this.searchTerm.trim() === '') return matches;
    const q = this.searchTerm.toLowerCase();
    const capPages = Math.min((serverTotalPages && serverTotalPages > 0) ? serverTotalPages : 200, 500);
    for (let p = 0; p < capPages; p++) {
      try {
        const pageData = await firstValueFrom(this.oIdeaService.getPage(p, this.numRpp, this.orderField, this.orderDirection, publico, this.searchTerm, this.categoriaFilter));
        const pageMatches = (pageData.content || []).filter(i => {
          const title = (i.titulo || '').toLowerCase();
          const desc = (i.comentario || '').toLowerCase();
          return title.includes(q) || desc.includes(q);
        });
        matches.push(...pageMatches);
        // If server indicates fewer pages than cap, we can stop early
        if (serverTotalPages && p >= serverTotalPages - 1) break;
        // Small optimization: if matches already exceed a large threshold, we can stop (avoid giant arrays)
        if (matches.length > 20000) break;
      } catch (err) {
        console.error('collectAllMatches: error fetching page', p, err);
        break;
      }
    }
    return matches;
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
  
    /**
     * Request bulk creation. If amount is high, show a warning card for confirmation.
     */
    // Threshold for showing the bulk warning card
    private readonly BULK_WARNING_THRESHOLD = 500;

    requestBulkCreate(amount: number = 20) {
      if (!amount || amount < 1) return;
      if (amount > this.BULK_WARNING_THRESHOLD) {
        this.pendingBulkAmount = amount;
        this.showBulkWarning = true;
        return;
      }
      this.bulkCreateIdeas(amount);
    }

    /**
     * Execute the bulk creation (called after confirmation when needed)
     */
    bulkCreateIdeas(amount: number = 20) {
      // reset any pending warning
      this.showBulkWarning = false;
      this.pendingBulkAmount = null;
      // show loading pop-up until backend finishes inserting
      this.isBulkLoading = true;
      this.oIdeaService.bulkCreate(amount).subscribe({
        next: () => {
          this.isBulkLoading = false;
          this.getPage();
        },
        error: (error: HttpErrorResponse) => {
          this.isBulkLoading = false;
          // Prefer an inline message in future; keep alert for now
          alert('Error al crear ideas fake');
          console.error(error);
        },
      });
    }

    cancelBulkCreate() {
      this.showBulkWarning = false;
      this.pendingBulkAmount = null;
    }
}
