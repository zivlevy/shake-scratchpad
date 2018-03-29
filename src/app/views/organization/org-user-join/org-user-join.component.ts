import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import {Observable} from 'rxjs/Observable';
import { mergeAll} from 'rxjs/operator/mergeAll';

@Component({
  selector: 'sk-org-user-join',
  templateUrl: './org-user-join.component.html',
  styleUrls: ['./org-user-join.component.scss']
})
export class OrgUserJoinComponent implements OnInit, OnDestroy {

  orgId: string;
  orgHome: string;
  // currentSkUser: SkUser;
  uid: string;
  currentOrgUser: OrgUser;
  queryParams: Params;
  destroy$: Subject<boolean> = new Subject<boolean>();
  inviteRoute = false;
  //
  constructor(private authService: AuthService,
              private orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {

    // get current org
    this.orgService.getCurrentOrg$()
      // .takeUntil(this.destroy$)
      .subscribe(org => {
        this.orgId = org;
        this.orgHome = '/org/' + org;
      });

    // this.authService.getSkUser$()
    //   .takeUntil(this.destroy$)
    //   .subscribe(user => {
    //     console.log(user);
    //   });
    //
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.uid = user ? user.uid : null;
        console.log(this.uid);
      });

    // get queryParams to see if we came here from an Invite
    this.route.queryParams
      .takeUntil(this.destroy$)
      .subscribe((params: Params) => {
        this.queryParams = params;
        console.log(this.route);
      });


    // get Org User
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        console.log('orgUser', orgUser);
        // this.user.isLoadingOrgUser = false;
        this.currentOrgUser = orgUser;
      });

    Observable.combineLatest(this.orgService.getCurrentOrg$(), this.authService.getUser$(), this.route.queryParams, this.orgService.getOrgUser$())
      .takeUntil(this.destroy$)
      .subscribe(() => {
        console.log(this.orgId, this.uid, this.queryParams, this.currentOrgUser);
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
          // user is logged in
          if (this.queryParams['mail']) {
            this.inviteRoute = true;
            this.processInvite(this.queryParams['name'].replace('+', ' '), this.queryParams['mail']);
          }
          if (this.currentOrgUser && !this.currentOrgUser.isPending) {
            this.router.navigate([`org/${this.orgId}`])
              .catch(err => console.log(err));
          }
        }
      });


  }

  processInvite(userName: string, userMail: string) {
    console.log('processing ', this.orgId, userName, userMail);

    this.orgService.getOrgUserInvite$(this.orgId, userMail)
      .takeUntil(this.destroy$)
      .subscribe((invite: any) => {
        if (invite) {

          if (!this.currentOrgUser) {
            this.orgService.addOrgToUser(this.orgId, this.uid)
              .catch(err => console.log(err));
          }
        } else {
          console.log('navigating');
          this.router.navigate([this.orgHome])
            .catch(err => console.log(err));
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
