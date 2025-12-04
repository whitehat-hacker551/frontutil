import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { serverURL } from '../environment/environment';
import { ISessionBean } from '../model/session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private http = inject(HttpClient);
  
  // Signal para manejar el estado del token JWT
  token = signal<string | null>(null);
  isLoggedIn = signal<boolean>(false);

  constructor() {
    // Recuperar el token del localStorage si existe
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken && storedToken !== 'null' && storedToken.trim() !== '') {
      this.token.set(storedToken);
      this.isLoggedIn.set(true);
    } else {
      // Limpiar tokens inválidos
      localStorage.removeItem('jwt_token');
    }
  }

  login(credentials: ISessionBean): Observable<string> {
    return this.http.post(`${serverURL}/session/login`, credentials, {
      responseType: 'text'
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.token.set(token);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.token.set(null);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return this.token();
  }
}
