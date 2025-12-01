import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {IPage} from "../../model/plist"
import {questionModel} from "../../model/alcanyiz/questionsModel_Alan"
import {Observable, catchError, throwError, of, switchMap} from 'rxjs'
import {serverURL} from '../../environment/environment'


@Injectable({
  providedIn: 'root',
})

export class jsQuestionService{
  constructor(private oHttp: HttpClient){}

  getPage(page: number, rpp: number, order: string = '', direction: string = ''): Observable<IPage<questionModel>> {
      // whitelist of allowed sortable fields (backend entity property names)
      const allowed = ['id', 'create_date', 'modify_date', 'question', 'answer1'];
      if (!allowed.includes(order)) {
        order = 'id';
      }
      if (direction === '') {
        direction = 'asc';
      }
      const url = serverURL + `/alcanyiz?page=${page}&size=${rpp}&sort=${order},${direction}`;
      return this.oHttp.get<IPage<questionModel>>(url).pipe(
        catchError((err) => {
          // If backend fails for this sort, retry once with a safe 'id' order
          if (err && err.status === 500 && order !== 'id') {
            const fallbackUrl = serverURL + `/alcanyiz?page=${page}&size=${rpp}&sort=id,${direction}`;
            console.warn('getPage: server returned 500 for order', order, 'retrying with id order');
            return this.oHttp.get<IPage<questionModel>>(fallbackUrl);
          }
          return throwError(() => err);
        })
      );
    }

      get(id: number): Observable<questionModel> {
        return this.oHttp.get<questionModel>(serverURL + '/alcanyiz/' + id);
      }

      create(question: Partial<questionModel>): Observable<number> {
        return this.oHttp.post<number>(serverURL + '/alcanyiz', question);
      }

      update(question: Partial<questionModel>): Observable<number> {
        return this.oHttp.put<number>(serverURL + '/alcanyiz', question);
      }

      delete(id: number): Observable<number> {
        return this.oHttp.delete<number>(serverURL + '/alcanyiz/' + id);
      }

      rellenaQuestions(numPosts: number): Observable<number> {
        return this.oHttp.get<number>(serverURL + '/alcanyiz/rellena/' + numPosts);
      }

}

