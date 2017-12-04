import {Injectable} from '@angular/core';
import {
    CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild,
    ActivatedRoute
} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OrgService} from '../org.service';

@Injectable()
export class OrgGuard implements CanActivate, CanActivateChild {

    constructor(private orgService: OrgService,
                private route: ActivatedRoute) {
    }

    canActivate(next: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        console.log('============> route to org');
        return true;
    }

    canActivateChild(next: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        return true;
    }
}
