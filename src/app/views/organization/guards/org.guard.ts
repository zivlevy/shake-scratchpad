import {Injectable} from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,
  ActivatedRoute, Router
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OrgService} from '../org.service';

@Injectable()
export class OrgGuard implements CanActivate {

    constructor(private orgService: OrgService,
                private route: ActivatedRoute,
                private router: Router,
                ) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const orgId = next.parent.params.id;
      console.log('============> route to org');
      console.log(orgId);
      return this.orgService.getOrgUserByOrgID$(orgId)
        .switchMap( user => {
          console.log(user);
          if (user && user.roles) {
            return Observable.of(true);
          } else {
            this.router.navigate(['org', orgId, 'org-join'])
              .catch(err => console.log(err));
            return Observable.of(false);
          }
        });
    }


}
