import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../../organization/org.service';
import {Observable} from 'rxjs/Observable';
import {Org} from '../../../model/org';

@Component({
  selector: 'sk-admin-orgs-management',
  templateUrl: './admin-orgs-management.component.html',
  styleUrls: ['./admin-orgs-management.component.scss']
})
export class AdminOrgsManagementComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;
  orgsObservable: Observable<Org>;

  constructor(public authService: AuthService,
              public orgService: OrgService) {}

  ngOnInit() {
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(authUser => {
        this.currentUser = authUser;
      });

    this.orgsObservable = this.orgService.getOrgs$();
  }

  test(o) {
    console.log(o);
  }
  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
