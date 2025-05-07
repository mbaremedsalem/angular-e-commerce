import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.domain}/api`;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private isRefreshing = false;
  isLoggedIn$ = this.isLoggedInSubject.asObservable();



  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    this.isLoggedInSubject.next(!!token);
  }

  login(username: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(`${this.apiUrl}/token/`, { username, password }).pipe(
      tap((response: any) => {
        this.storeTokens(response, rememberMe);
        this.isLoggedInSubject.next(true);
      }),
      catchError(error => {
        this.clearTokens();
        return throwError(() => error);
      })
    );
  }

  private storeTokens(tokens: { access: string, refresh: string }, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('access_token', tokens.access);
    storage.setItem('refresh_token', tokens.refresh);
  }

  logout(): void {
    this.clearTokens();
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  private clearTokens(): void {
    ['access_token', 'refresh_token'].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  }

  refreshToken(): Observable<any> {
    if (this.isRefreshing) {
      return throwError(() => new Error('Refresh token already in progress'));
    }

    this.isRefreshing = true;
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.isRefreshing = false;
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken }).pipe(
      tap((response: any) => {
        const rememberMe = !!localStorage.getItem('refresh_token');
        this.storeTokens(response, rememberMe);
        this.isRefreshing = false;
      }),
      catchError(error => {
        this.isRefreshing = false;
        this.logout();
        return throwError(() => error);
      })
    );
  }

  
}