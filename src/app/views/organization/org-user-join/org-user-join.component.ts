import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import { combineLatest } from 'rxjs';
import 'rxjs-compat';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-org-user-join',
  templateUrl: './org-user-join.component.html',
  styleUrls: ['./org-user-join.component.scss']
})
export class OrgUserJoinComponent implements OnInit, OnDestroy {

  orgId: string;
  orgHome: string;
  uid: string;
  uemail: string;
  currentOrgUser: OrgUser;
  queryParams: Params;
  destroy$: Subject<boolean> = new Subject<boolean>();
  inviteRoute = false;
  afterTimeDelay = false;
  //
  constructor(private authService: AuthService,
              private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    setTimeout(() => this.afterTimeDelay = true, 3000);

    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => {
        if (org === '_noOrg') {
          this.router.navigate(['/noOrg'])
            .catch(err => console.log(err));
        } else {
          this.orgId = org;
          this.orgHome = '/org/' + org;
        }

      });

    this.authService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.uid = user ? user.uid : null;
        this.uemail = user ? user.email.toLowerCase() : null;
      });

    // get queryParams to see if we came here from an Invite
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.queryParams = params;
      });


    // get Org User
    this.orgService.getOrgUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((orgUser: OrgUser) => {
        // this.user.isLoadingOrgUser = false;
        this.currentOrgUser = orgUser;
      });

    // ToDo - deal with deprecated
    combineLatest(this.orgService.getCurrentOrg$(), this.authService.getUser$(), this.route.queryParams, this.orgService.getOrgUser$())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (! this.orgId) {
          return;
        }

        // if the user is not logged in

        if (!this.uid) {

          if (this.queryParams && this.queryParams['mail']) {

            // the user is not logged in. Navigated here thru mail
            this.authService.isMailRegistered(this.queryParams['mail'])
              .then(mailExists => {
                if (mailExists) {
                  this.router.navigate([`org/${this.orgId}/login`],
                    {queryParams: {
                        returnUrl:  `org/${this.orgId}/org-join`,
                        name: this.queryParams['name'],
                        mail: this.queryParams['mail']
                      }
                    })
                    .catch(err => console.log(err));
                } else {
                  this.router.navigate([`org/${this.orgId}/register`],
                    {queryParams: {
                        returnUrl:  `org/${this.orgId}/org-join`,
                        name: this.queryParams['name'],
                        mail: this.queryParams['mail']
                      }
                    })
                    .catch(err => console.log(err));
                }
              });
          } else {

            // the user is not logged in. Navigated here directly
            this.router.navigate([`org/${this.orgId}/register`],
              {queryParams: {
                  returnUrl:  `org/${this.orgId}/org-join`
                }
              })
              .catch(err => console.log(err));
          }

        } else {
          // if the user is logged in
          // 1st - check if there is an invite waiting
          this.orgService.getOrgUserInvite$(this.orgId, this.uemail)
            .pipe(takeUntil(this.destroy$))
            .subscribe((invite: any) => {

              if (invite) {
                this.inviteRoute = true;

                // if (for some reason) there is an invite while the user is pending
                if (this.currentOrgUser) {
                  this.orgService.deleteLocalOrgFromSelf(this.uid)
                    .catch(err => console.log(err))
                    .then(() => {
                      // else - there is an invite. Add the user to this org
                      this.orgService.addOrgToUser(this.orgId, this.uid)
                        .catch(err => console.log(err));
                    });
                } else {
                  this.orgService.addOrgToUser(this.orgId, this.uid)
                    .catch(err => console.log(err));
                }
              }
            });

          // if the user is logged in and is already org member
          if (this.currentOrgUser && !this.currentOrgUser.isPending) {
            this.router.navigate([`org/${this.orgId}`])
              .catch(err => console.log(err));
          }
        }
      });


  }

  join() {
    this.orgService.joinOrg();
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
