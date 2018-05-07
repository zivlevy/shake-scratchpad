import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {LanguageService} from '../../core/language.service';
import {AuthService} from '../../core/auth.service';
import {ToasterService} from '../../core/toaster.service';
import {OrgService} from '../../views/organization/org.service';

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

  constructor(private lngService: LanguageService,
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
        });
  }

  resend(){
    this.authService.sendEmailVerification(this.authUser, this.homeRoute)
      .then(() => {
        this.toasterService.toastSuccess('Mail Sent');
      })
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
