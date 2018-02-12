import {Injectable} from '@angular/core';
import {
  CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild,
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
        console.log('============> route to org');
        console.log(next.parent.params.id);
        const orgId = next.params.id;
        return this.orgService.getOrgUserByOrgID$(next.params.id)
          .switchMap( user => {
            if (user && user.roles) {
              return Observable.of(true);
            } else {
              console.log(next, state);
              this.router.navigate(['org/joinOrg', orgId])
              return Observable.of(false);
            }
          });


    }

}
