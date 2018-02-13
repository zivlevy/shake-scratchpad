import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {Org} from '../../../model/org';
import {User} from '../../../model/user';
import {ActivatedRoute, Params, Router} from '@angular/router';
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

    // get queryParams to see if we came here from an Invite
    this.route.queryParams
      .takeUntil(this.destroy$)
      .subscribe((params: Params) => {

        // get current authenticatedUser
        this.authService.getUser$()
          .takeUntil(this.destroy$)
          .subscribe(user => {
            this.user.currentAuthUser = user;

            // if the user is not logged in
            if (!this.user.currentAuthUser) {

              if (params['mail']) {
                this.authService.isMailRegistered(params['mail'])
                  .then(mailExists => {
                    if (mailExists) {
                      this.router.navigate([`org/${this.org.orgId}/login`],
                        {queryParams: {
                            returnUrl:  `org/${this.org.orgId}/org-join`,
                            name: params['name'],
                            mail: params['mail']
                          }
                        });                  } else {
                      this.router.navigate([`org/${this.org.orgId}/register`],
                        {queryParams: {
                            returnUrl:  `org/${this.org.orgId}/org-join`,
                            name: params['name'],
                            mail: params['mail']
                          }
                        });
                    }
                  });
              } else {
                this.router.navigate([`org/${this.org.orgId}/register`],
                  {queryParams: {
                      returnUrl:  `org/${this.org.orgId}/org-join`
                    }
                  });
              }

            } else {
              // user is logged in
              if (params['mail']) {
                this.processInvite(params['name'].replace('+', ' '), params['mail']);
              }
            }
          });


      });



    // get Org User
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        console.log('orgUser', orgUser);
        this.user.isLoadingOrgUser = false;
        this.user.currentOrgUser = orgUser;

        // if this is an authorized Org User - go to Org Home Page
        if (this.user.currentOrgUser && !this.user.currentOrgUser.isPending) {
          this.router.navigate([`org/${this.org.orgId}`]);

        }
      });



  }

  processInvite(userName: string, userMail: string) {
    console.log('processing ', userName, userMail);
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
