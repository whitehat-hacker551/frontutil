import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../../environment/environment';
import { IPage } from '../../model/plist';
import { IZanon } from '../../model/zanon/zanon';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZanonService {

    constructor(private oHttp: HttpClient) {

    }

    getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<IZanon>> {
        if (order === '') {
            order = 'id';
        }

        if (direction === '') {
            direction = 'asc';
        }

        return this.oHttp.get<IPage<IZanon>>(serverURL + `/zanon?page=${page}&size=${rpp}&sort=${order},${direction}`);
    }

    get(id: number): Observable<IZanon> {
        return this.oHttp.get<IZanon>(serverURL + '/zanon/' + id);
    }

    create(zanon: Partial<IZanon>): Observable<number> {
        return this.oHttp.post<number>(serverURL + '/zanon', zanon);
    }

    update(zanon: Partial<IZanon>): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/zanon', zanon);
    }

    delete(id: number): Observable<number> {
        return this.oHttp.delete<number>(serverURL + '/zanon/' + id);
    }

    rellenaBlog(numPosts: number): Observable<number> {
        return this.oHttp.get<number>(serverURL + '/zanon/rellena/' + numPosts);
    }
}
