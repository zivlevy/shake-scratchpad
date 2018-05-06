import {Injectable} from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,
  ActivatedRoute, Router
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {OrgService} from '../org.service';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class OrgGuard implements CanActivate {

    constructor(private orgService: OrgService,
                private route: ActivatedRoute,
                private router: Router,
                ) { }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const orgId = next.parent.params.id;

      return this.orgService.getOrgUserByOrgID$(orgId)
        .pipe(
          switchMap( user => {
            if (user && user.roles && !user.isPending) {
              return of(true);
            } else {
              this.router.navigate(['org', orgId, 'org-join'])
                .catch(err => console.log(err));
              return of(false);
            }
          })
        );
    }
}

@Injectable()
export class OrgAdminGuard implements CanActivate {

  constructor(private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const orgId = next.parent.params.id;

    return this.orgService.getOrgUserByOrgID$(orgId)
      .pipe(
        switchMap( user => {
          if (user && user.roles.admin ) {
            return of(true);
          } else {
            this.router.navigate(['org', orgId, 'org-join'])
              .catch(err => console.log(err));
            return of(false);
          }
        })
      );
  }
}

@Injectable()
export class OrgEditorGuard implements CanActivate {

  constructor(private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router,
  ) { }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const orgId = next.parent.params.id;

    return this.orgService.getOrgUserByOrgID$(orgId)
      .pipe(
        switchMap( user => {
          if (user && user.roles.editor ) {
            return of(true);
          } else {
            this.router.navigate(['org', orgId, 'org-join'])
              .catch(err => console.log(err));
            return of(false);
          }
        })
      );
  }
}
