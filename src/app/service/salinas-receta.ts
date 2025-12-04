import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { Observable } from 'rxjs';
import { ISalinasReceta } from '../model/salinas-receta';

@Injectable({
  providedIn: 'root',
})
export class SalinasService {

  constructor(private oHttp: HttpClient) { }

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<ISalinasReceta>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<ISalinasReceta>>(serverURL + `/receta?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  get(id: number): Observable<ISalinasReceta> {
    return this.oHttp.get<ISalinasReceta>(serverURL + '/receta/' + id);
  }

  create(receta: Partial<ISalinasReceta>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/receta', receta);
  }

  update(receta: Partial<ISalinasReceta>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/receta', receta);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/receta/' + id);
  }

  // MÉTODO PARA GENERAR DATOS FALSOS
  bulkCreate(amount: number): Observable<number> {
    // Asume que el backend tiene el endpoint /receta/populate/{amount}
    return this.oHttp.post<number>(serverURL + '/receta/populate/' + amount, null);
  }
}