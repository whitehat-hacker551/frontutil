import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ISoares } from '../model/soares';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SoaresService {

  sUrl: string = serverURL + '/soares';

  constructor(private oHttp: HttpClient) { }

  getPageAdmin(page: number, rpp: number, order: string = '', direction: string = '', filter: string = '', soloPendientes: boolean = false): Observable<IPage<ISoares>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    let sUrl: string = this.sUrl + '/admin' + '?page=' + (page - 1) + '&size=' + rpp + '&sort=' + order + ',' + direction;
    if (filter) {
      sUrl += '&filter=' + filter;
    }
    if (soloPendientes) {
      sUrl += '&soloPendientes=true';
    }
    return this.oHttp.get<IPage<ISoares>>(sUrl);
  }

  getPageUser(page: number, rpp: number, order: string = '', direction: string = '', filter: string = ''): Observable<IPage<ISoares>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    let sUrl: string = this.sUrl + '/user' + '?page=' + (page - 1) + '&size=' + rpp + '&sort=' + order + ',' + direction;
    if (filter) {
      sUrl += '&filter=' + filter;
    }
    return this.oHttp.get<IPage<ISoares>>(sUrl);
  }

  getOne(id: number): Observable<ISoares> {
    return this.oHttp.get<ISoares>(this.sUrl + '/' + id);
  }

  removeOne(id: number): Observable<number> {
    return this.oHttp.delete<number>(this.sUrl + '/' + id);
  }

  createOne(oSoares: ISoares): Observable<number> {
    return this.oHttp.post<number>(this.sUrl + '/', oSoares);
  }

  updateOne(oSoares: ISoares): Observable<ISoares> {
    return this.oHttp.put<ISoares>(this.sUrl + '/', oSoares);
  }

  populate(amount: number): Observable<number> {
    return this.oHttp.post<number>(this.sUrl + '/populate/' + amount, null);
  }

  empty(): Observable<number> {
    return this.oHttp.delete<number>(this.sUrl + '/empty');
  }
}
