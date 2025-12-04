import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../../environment/environment';
import { IPage } from '../../model/plist';
import { IPelicula } from '../../model/sempertegui/semperteguiInterface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SemperteguiService {

  constructor(private httpClient: HttpClient) { }

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<IPelicula>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.httpClient.get<IPage<IPelicula>>(`${serverURL}/sempertegui?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  get(id: number): Observable<IPelicula> {
    return this.httpClient.get<IPelicula>(`${serverURL}/sempertegui/${id}`);
  }

  create(pelicula: Partial<IPelicula>): Observable<number> {
    return this.httpClient.post<number>(`${serverURL}/sempertegui`, pelicula);
  }

  update(pelicula: Partial<IPelicula>): Observable<number> {
    return this.httpClient.put<number>(`${serverURL}/sempertegui`, pelicula);
  }

  delete(id: number): Observable<number> {
    return this.httpClient.delete<number>(`${serverURL}/sempertegui/${id}`);
  }

  rellenaPeliculas(): Observable<number> {
    return this.httpClient.get<number>(`${serverURL}/sempertegui/rellena`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${serverURL}/sempertegui/count`);
  }
}
