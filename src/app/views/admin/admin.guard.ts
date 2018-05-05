import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {switchMap} from 'rxjs/operators';
@Injectable()
export class SkAdminGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.isCurrentSkAdmin$()
      .pipe(
        switchMap( isAdmin => {
          if (isAdmin) {
            return Observable.of(true);
          } else {
            this.router.navigate([''])
              .catch(err => console.log(err));
            return Observable.of(false);
          }
        })
      );
  }
}

@Injectable()
export class SkEditorGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.authService.isCurrentSkEditor$()
      .pipe(
        switchMap( isAdmin => {
          if (isAdmin) {
            return Observable.of(true);
          } else {
            this.router.navigate([''])
              .catch(err => console.log(err));
            return Observable.of(false);
          }
        })
      );
  }
}
