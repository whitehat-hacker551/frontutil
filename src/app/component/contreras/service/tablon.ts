import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../../../environment/environment';
import { IPage } from '../model/plist';
import { ITablon } from '../model/tablon';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TablonService {

  constructor(private oHttp: HttpClient) { }

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<ITablon>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<ITablon>>(serverURL + `/contreras?page=${page}&size=${rpp}&sort=${order},${direction}`);
  }

  get(id: number): Observable<ITablon> {
    return this.oHttp.get<ITablon>(serverURL + '/contreras/' + id);
  }

  create(Tablon: Partial<ITablon>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/contreras', Tablon);
  }

  update(Tablon: Partial<ITablon>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/contreras', Tablon);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/contreras/' + id);
  }

  rellenaTablon(numPosts: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/contreras/rellena/' + numPosts);
  }

}
