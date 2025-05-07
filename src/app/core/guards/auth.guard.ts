import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isLoggedIn$.pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          return of(true);
        }

        // Si pas connecté mais a un refresh token, tente de rafraîchir
        const refreshToken = this.authService.getRefreshToken();
        if (refreshToken) {
          return this.authService.refreshToken().pipe(
            map(() => true),
            catchError(() => this.redirectToLogin(state))
          );
        }

        return this.redirectToLogin(state);
      })
    );
  }

  private redirectToLogin(state: RouterStateSnapshot): Observable<UrlTree> {
    return of(
      this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      })
    );
  }
}