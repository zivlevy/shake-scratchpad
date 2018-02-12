import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {Org} from '../../../model/org';
import {User} from '../../../model/user';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';

@Component({
  selector: 'sk-org-user-join',
  templateUrl: './org-user-join.component.html',
  styleUrls: ['./org-user-join.component.scss']
})
export class OrgUserJoinComponent implements OnInit, OnDestroy {

  org: Org = new Org();
  user: User = new User();
  destroy$: Subject<boolean> = new Subject<boolean>();
  //
  constructor(private authService: AuthService,
              private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.org.orgId = org;
        this.org.orgHome = '/org/' + org;
      });

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user.currentAuthUser = user;

        // if the user is not logged in
        if (!this.user.currentAuthUser) {
          this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: {returnUrl:  this.router.routerState.snapshot.url}});
        }
      });

    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        console.log('orgUser', orgUser);
        this.user.isLoadingOrgUser = false;
        this.user.currentOrgUser = orgUser;

        if (this.user.currentOrgUser && !this.user.currentOrgUser.isPending) {
          this.router.navigate([`org/${this.org.orgId}`]);

        }
      });
  }

  join() {
    this.orgService.joinToOrg();
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
