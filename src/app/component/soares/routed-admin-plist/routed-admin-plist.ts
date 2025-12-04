// Componente que muestra la vista de administración con controles para filtrar, crear, generar datos y una tabla con preguntas y acciones
// Obtiene la página de preguntas para el administrador, validando que la página no sea negativa
// Cambia la cantidad de elementos por página
// Cambia el orden de las preguntas en la tabla
// Filtra las preguntas según el texto ingresado
// Genera datos de prueba y vacía la lista
// Permite al administrador publicar o despublicar una pregunta
// Permite al administrador aprobar o desaprobar una pregunta
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { ISoares } from '../../../model/soares';
import { SoaresService } from '../../../service/soares';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routed-admin-plist',
  templateUrl: './routed-admin-plist.html',
  styleUrl: './routed-admin-plist.css',
  standalone: true,
  imports: [RouterLink, Paginacion, BotoneraRpp, FormsModule, CommonModule],
})
export class SoaresRoutedAdminPlist implements OnInit {
    soloPendientes: boolean = false;
  oPage: IPage<ISoares> | null = null;
  numPage: number = 0;
  numRpp: number = 5;
  numTotalPages: number = 0;
  numTotalElements: number = 0;
  orderField: string = 'id';
  orderDirection: string = 'asc';
  filter: string = '';
  numPopulate: number = 10;

  constructor(private soaresService: SoaresService) {}

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    // Validar que la página nunca sea negativa
    const safePage = this.numPage < 0 ? 0 : this.numPage;
    this.soaresService.getPageAdmin(
      safePage,
      this.numRpp,
      this.orderField,
      this.orderDirection,
      this.filter,
      this.soloPendientes
    ).subscribe({
      next: (resp: IPage<ISoares>) => {
        this.oPage = resp;
        this.numTotalPages = resp.totalPages;
        this.numTotalElements = resp.totalElements;
        this.numPage = resp.number;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  onPageChange(n: number) {
    // Validar que la página nunca sea negativa
    this.numPage = n < 0 ? 0 : n;
    this.getPage();
  }

  onRppChange(rpp: number) {
    this.numRpp = rpp;
    this.numPage = 0;
    this.getPage();
    return false;
  }

  onOrder(order: string) {
    this.orderField = order;
    this.orderDirection = this.orderDirection === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  onFilterChange(filter: string) {
    this.filter = filter;
    this.numPage = 0;
    this.getPage();
  }

  onPopulate(amount: any) {
    amount = parseInt(amount);
    this.soaresService.populate(amount).subscribe({
      next: (resp: number) => {
        this.numTotalElements = resp;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  onEmpty() {
    this.soaresService.empty().subscribe({
      next: (resp: number) => {
        this.numTotalElements = resp;
        this.getPage();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  // Lógica para el botón de Publicación (toggle)
  togglePublicacion(soares: ISoares): void {
    const updatedSoares: ISoares = {
      ...soares,
      publicacion: !soares.publicacion,
    };
    this.soaresService.updateOne(updatedSoares).subscribe({
      next: () => {
        soares.publicacion = !soares.publicacion; // Actualiza el estado localmente
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cambiar el estado de publicación:', err);
      },
    });
  }

  // Lógica para el botón de Aprobación (toggle)
  toggleAprobacion(soares: ISoares): void {
    // Lógica de aprobación: si está pendiente, se aprueba. Si está aprobado, se desaprueba (vuelve a pendiente).
    // Asumo que 'aprobacion' es un campo booleano o similar. Si es un estado más complejo (e.g., 'PENDIENTE', 'APROBADO', 'RECHAZADO'),
    // se necesitaría más información. Por ahora, lo implemento como un simple toggle booleano.
    const updatedSoares: ISoares = {
      ...soares,
      aprobacion: !soares.aprobacion, // Asumiendo que existe un campo 'aprobacion' en ISoares
    };
    this.soaresService.updateOne(updatedSoares).subscribe({
      next: () => {
        soares.aprobacion = !soares.aprobacion; // Actualiza el estado localmente
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cambiar el estado de aprobación:', err);
      },
    });
  }
}
