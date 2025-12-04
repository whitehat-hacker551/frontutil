import { Component } from '@angular/core';
import { ITablon } from '../../model/tablon';
import { TablonService } from '../../service/tablon';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UnroutedUserView } from "../unrouted-user-view/unrouted-user-view";

@Component({
  selector: 'app-routed-user-view',
  imports: [UnroutedUserView],
  templateUrl: './routed-user-view.html',
  styleUrl: './routed-user-view.css',
})
export class RoutedUserView {
  oTablon: ITablon | null = null;

  constructor(private oTablonService: TablonService, private route: ActivatedRoute) {
    // Obtener el ID del tablon desde la ruta
    const idParam = this.route.snapshot.paramMap.get('id');
    const tablonId = idParam ? Number(idParam) : NaN;
    if (isNaN(tablonId)) {
      console.error('Invalid tablon id:', idParam);
      return;
    }
    this.getTablon(tablonId);
  }

  ngOnInit() { }

  getTablon(tablonId: number) {
    this.oTablonService.get(tablonId).subscribe({
      next: (data: ITablon) => {
        if (data.publico) {
          this.oTablon = data;
        } else {
          this.oTablon = null;
        }
      },
      error: () => {
        this.oTablon = null;
      },
    });
  }
}
