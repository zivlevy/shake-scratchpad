import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable, of } from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {switchMap} from 'rxjs/operators';
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getUser$()
      .pipe(
        switchMap( user => {
          if (user.emailVerified) {
            return of(true);
          } else {
            this.router.navigate(['not-authenticated']);
            return of(false);
          }
        })
      );
  }
}
