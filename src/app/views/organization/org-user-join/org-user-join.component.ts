import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {Org} from '../../../model/org';
import {User} from '../../../model/user';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'sk-org-user-join',
  templateUrl: './org-user-join.component.html',
  styleUrls: ['./org-user-join.component.scss']
})
export class OrgUserJoinComponent implements OnInit, OnDestroy {

  org: Org = new Org();
  user: User = new User();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user.currentAuthUser = user;
        console.log(user);
        const orgId = this.router.routerState.snapshot.url.match('/joinOrg/(.*)')[1];

        // if the user is not logged in
        if (!this.user.currentAuthUser) {
          this.router.navigate([`org/${orgId}/register`], {queryParams: {returnUrl:  this.router.routerState.snapshot.url}});
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
