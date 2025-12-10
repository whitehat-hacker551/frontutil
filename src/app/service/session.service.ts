import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public subjectLogin: Subject<void> = new Subject<void>();
  public subjectLogout: Subject<void> = new Subject<void>();

  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
    this.subjectLogin.next();
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('token');
    this.subjectLogout.next();
  }

  isSessionActive(): boolean {
    return this.getToken() !== null || localStorage.getItem('token') !== null;
  }
}
