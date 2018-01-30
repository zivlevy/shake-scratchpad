import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Org} from "../../../model/org";
import {User} from "../../../model/user";
import {OrgUser} from "../../../model/org-user";
import {AuthService} from "../../../core/auth.service";
import {OrgService} from "../org.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'sk-org-invite-page',
  templateUrl: './org-invite-page.component.html',
  styleUrls: ['./org-invite-page.component.scss']
})
export class OrgInvitePageComponent implements OnInit, OnDestroy {

  org: Org = new Org();
  user: User = new User();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.user.isLoadingOrgUser = true;
    this.user.isAuthenticated = false;

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user.currentAuthUser = user;
        console.log(user);

        // if the user is not logged in
        if (!this.user.currentAuthUser) {
          this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: {returnUrl:  this.router.routerState.snapshot.url}});
        }

      });

    // get user info
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {

        // if the user is logged in but is not registered in this organization
        this.user.isLoadingOrgUser = false;
        this.user.currentOrgUser = orgUser;

      });


    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user.currentSkUser = user;

        // user is registered & loggen on
        if (this.user.currentSkUser.uid && this.user.currentAuthUser.uid) {
          console.log(this.org.orgId, this.user.currentAuthUser.email);
          this.orgService.getOrgUserInvite$(this.org.orgId, this.user.currentAuthUser.email)
            .takeUntil(this.destroy$)
            .subscribe((invite: any) => {
              if (invite) {
                console.log(this.org.orgId, this.user.currentAuthUser.uid, this.user.currentSkUser,
                  invite.isAdmin, invite.isEditor, invite.isViewer);
                if (!this.user.currentOrgUser) {
                  this.orgService.addUserToOrg(this.org.orgId, this.user.currentAuthUser.uid, this.user.currentSkUser,
                    invite.isAdmin, invite.isEditor, invite.isViewer);
                }
                this.orgService.deleteOrgUserInviteP(this.org.orgId, this.user.currentAuthUser.email);
              }
            });
        }
      });

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        console.log('org', org);
        this.org.orgId = org;
        this.org.orgHome = '/org/' + org;
      });

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
