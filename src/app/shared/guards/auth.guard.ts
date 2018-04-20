import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log(' Auth Guard =======>');
    return this.authService.getUser$()
      .switchMap( user => {
        if (user.emailVerified) {
          return Observable.of(true);
        } else {
          this.router.navigate(['notAuthenticated']);
          return Observable.of(false);
        }
      });
  }
}
