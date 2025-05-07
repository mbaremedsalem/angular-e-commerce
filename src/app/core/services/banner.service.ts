import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannerService {
  private apiUrl = `${environment.domain}/api/banners`;

  constructor(private http: HttpClient) {}

  getBanners(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}