import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private domain = environment.domain;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.domain}${endpoint}`, {
      params: new HttpParams({ fromObject: params })
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.domain}${endpoint}`, body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.domain}${endpoint}`, body);
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.domain}${endpoint}`, body);
  }

  delete<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.delete<T>(`${this.domain}${endpoint}`, {
      params: new HttpParams({ fromObject: params })
    });
  }
}
