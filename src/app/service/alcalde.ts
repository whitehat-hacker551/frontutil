import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { IAlcalde } from '../model/alcalde';

@Injectable({
  providedIn: 'root',
})
export class AlcaldeService {
  constructor(private http: HttpClient) { }

  getPage(page: number, rpp: number, order: string = 'id', direction: string = 'asc', publishedOnly: boolean = false): Observable<IPage<IAlcalde>> {
    const query = new URLSearchParams({
      page: page.toString(),
      size: rpp.toString(),
      sort: `${order},${direction}`
    });
    if (publishedOnly) {
      query.append('publicado', 'true');
    }
    return this.http.get<IPage<IAlcalde>>(`${serverURL}/alcalde?${query.toString()}`);
  }

  get(id: number): Observable<IAlcalde> {
    return this.http.get<IAlcalde>(`${serverURL}/alcalde/${id}`);
  }

  create(payload: Partial<IAlcalde>): Observable<number> {
    return this.http.post<number>(`${serverURL}/alcalde`, payload);
  }

  update(payload: Partial<IAlcalde>): Observable<number> {
    return this.http.put<number>(`${serverURL}/alcalde`, payload);
  }

  delete(id: number): Observable<number> {
    return this.http.delete<number>(`${serverURL}/alcalde/${id}`);
  }

  rellena(cantidad: number): Observable<number> {
    return this.http.get<number>(`${serverURL}/alcalde/rellena/${cantidad}`);
  }

  selection(): Observable<IAlcalde[]> {
    return this.http.get<IAlcalde[]>(`${serverURL}/alcalde/selection`);
  }
}
