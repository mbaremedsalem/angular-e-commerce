// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {

//   constructor() { }
// }


// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  // Ajoutez d'autres champs selon la réponse de l'API
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.domain}/auth/me/`;
  constructor(private http: HttpClient) { }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl);
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl, profileData);
  }
}