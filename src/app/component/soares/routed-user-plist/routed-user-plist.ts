// Componente que muestra la lista de preguntas para el usuario, con paginación, agrupación y búsqueda
// Agrupa las preguntas por texto para mostrar en tarjetas
// Maneja el cambio de página y cantidad de elementos por página
// Filtra las preguntas según el texto ingresado
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { IPage } from '../../../model/plist';
import { ISoares } from '../../../model/soares';
import { SoaresService } from '../../../service/soares';
import { Paginacion } from "../../shared/paginacion/paginacion";
import { BotoneraRpp } from "../../shared/botonera-rpp/botonera-rpp";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-routed-user-plist',
  templateUrl: './routed-user-plist.html',
  styleUrl: './routed-user-plist.css',
  standalone: true,
  imports: [Paginacion, FormsModule, RouterLink, BotoneraRpp, CommonModule],
})
export class SoaresRoutedUserPlist implements OnInit {
  oPage: IPage<ISoares> | null = null;
  numPage: number = 0;
  numRpp: number = 10;
  numTotalPages: number = 0;
  numTotalElements: number = 0;
  orderField: string = 'fechaCreacion';
  orderDirection: string = 'desc';
  filter: string = '';
  groupedSoares: Array<{ pregunta: string, items: ISoares[], expanded: boolean }> = [];

  constructor(private soaresService: SoaresService) {}

  ngOnInit(): void {
    this.getPage();
  }

  getPage(): void {
    this.soaresService.getPageUser(this.numPage, this.numRpp, this.orderField, this.orderDirection, this.filter).subscribe({
      next: (resp: IPage<ISoares>) => {
        this.oPage = resp;
        this.numTotalPages = resp.totalPages;
        this.numTotalElements = resp.totalElements;
        this.numPage = resp.number;
        this.groupedSoares = this.groupByPregunta(resp.content);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    })
  }

  onPageChange(n: number) {
    this.numPage = n;
    this.getPage();
  }

  onRppChange(rpp: number) {
    this.numRpp = rpp;
    this.numPage = 0;
    this.getPage();
  }

  onFilterChange(filter: string) {
    this.filter = filter;
    this.numPage = 0;
    this.getPage();
  }

  groupByPregunta(soaresList: ISoares[]): Array<{ pregunta: string, items: ISoares[], expanded: boolean }> {
    const map = new Map<string, ISoares[]>();
    soaresList.forEach(item => {
      if (!map.has(item.preguntas)) {
        map.set(item.preguntas, []);
      }
      map.get(item.preguntas)!.push(item);
    });
    return Array.from(map.entries()).map(([pregunta, items]) => ({ pregunta, items, expanded: false }));
  }
  }
