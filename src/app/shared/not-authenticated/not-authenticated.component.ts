import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {LanguageService} from '../../core/language.service';
import {AuthService} from '../../core/auth.service';
import {ToasterService} from '../../core/toaster.service';
import {OrgService} from '../../views/organization/org.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'sk-not-authenticated',
  templateUrl: './not-authenticated.component.html',
  styleUrls: ['./not-authenticated.component.scss']
})
export class NotAuthenticatedComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  direction: string = 'ltr';
  authUser;
  homeRoute: string;
  orgId: string;
  url: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private toasterService: ToasterService,
              private orgService: OrgService,
              private authService: AuthService) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);


  }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => {
        this.orgId = org;
        if (org) {
          this.homeRoute = 'org/' + org;
        } else {
          this.homeRoute = '';
        }
      });

    this.authService.getUser$()
      .pipe(
        takeUntil(this.destroy$))
      .subscribe(user => {
        this.authUser = user;
        if (this.authUser.emailVerified) {
          this.router.navigate([this.url])
            .catch(err => console.log(err));
        }
        });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.url = params.url ? params.url : '/';
      });

  }

  resend(){
    this.authService.sendEmailVerification(this.authUser, this.homeRoute)
      .then(() => {
        this.toasterService.toastSuccess('Mail Sent');
      })
      .catch(err => {
        this.toasterService.toastError('Error sending verification mail');
        console.log(err);
      });
  }

  reload() {
    this.router.navigate([this.url])
      .catch(err => console.log(err));
    window.location.reload();
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
