import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { IPalomares } from '../model/palomares';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PalomaresService {

  constructor(private oHttp: HttpClient) { }

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<IPalomares>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    const url = serverURL + `/Ian?page=${page}&size=${rpp}&sort=${order},${direction}`;
    console.log('PalomaresService - Llamando a:', url);
    return this.oHttp.get<IPage<IPalomares>>(url);
  }

  get(id: number): Observable<IPalomares> {
    return this.oHttp.get<IPalomares>(serverURL + '/Ian/' + id);
  }

  create(palomares: Partial<IPalomares>): Observable<IPalomares> {
    const url = serverURL + '/Ian';
    console.log('PalomaresService - Creando tarea en:', url);
    console.log('Datos a enviar:', palomares);
    return this.oHttp.post<IPalomares>(url, palomares);
  }

  update(palomares: Partial<IPalomares>): Observable<IPalomares> {
    return this.oHttp.put<IPalomares>(serverURL + '/Ian/' + palomares.id, palomares);
  }

  delete(id: number): Observable<void> {
    return this.oHttp.delete<void>(serverURL + '/Ian/' + id);
  }

  rellenaPalomares(numTareas: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/Ian/rellena/' + numTareas);
  }

}
