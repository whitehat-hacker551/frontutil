import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ICastanyera } from '../model/castanyera';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CastanyeraService {
  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    rpp: number,
    order: string = '',
    direction: string = ''
  ): Observable<IPage<ICastanyera>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    return this.oHttp.get<IPage<ICastanyera>>(
      serverURL + `/castanyera?page=${page}&size=${rpp}&sort=${order},${direction}`
    );
  }

  get(id: number): Observable<ICastanyera> {
    return this.oHttp.get<ICastanyera>(serverURL + '/castanyera/' + id);
  }

  create(castanyera: Partial<ICastanyera>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/castanyera', castanyera).pipe(
      tap((resp) => console.debug('Castanyera.create response:', resp)),
      catchError((err) => {
        console.error('Castanyera.create error:', err);
        return throwError(() => err);
      })
    );
  }

  update(castanyera: Partial<ICastanyera>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/castanyera', castanyera);
  }

  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/castanyera/' + id);
  }

  rellenaCastanyera(numPosts: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/castanyera/rellena/' + numPosts).pipe(
      tap((resp) => console.debug('Castanyera.rellenaCastanyera response:', resp)),
      catchError((err) => {
        console.error('Castanyera.rellenaCastanyera error:', err);
        return throwError(() => err);
      })
    );
  }
}
