import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {User} from '../../../model/user';
import {LanguageService} from '../../../core/language.service';
import {Org} from '../../../model/org';


@Component({
  selector: 'sk-org-container',
  templateUrl: './org-container.component.html',
  styleUrls: ['./org-container.component.scss']
})
export class OrgContainerComponent implements OnInit, OnDestroy {

  org: Org = new Org();
  user: User = new User();

  returnRoute: string;
  requestName: string;
  requestEmail: string;
  queryParams;
  rtl = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private lngService: LanguageService,
              private authService: AuthService,
  ) {}

  ngOnInit() {

    this.user.isLoadingOrgUser = true;
    this.user.isAuthenticated = false;

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.user.currentAuthUser = user;
        this.user.isAuthenticated = user ? user.emailVerified : null;
      });

    // get user info
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        this.user.isLoadingOrgUser = false;
        this.user.currentOrgUser = orgUser;
      });

    // get org private data
    this.orgService.getOrgPrivateData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.org.orgSearchKey = orgData.searchKey;
        }
      });

    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        // console.log('getSkUser', user);
        this.user.currentSkUser = user;
      });

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        if (org === '_noOrg ') {
          this.router.navigate(['/noOrg'])
            .catch(err => console.log(err));
        } else {
          this.org.orgId = org;
          this.org.orgHome = '/org/' + org;
        }
      });

    this.org.logoUrl = 'assets/img/shake-logo/logo_no_text.svg';
    this.org.bannerUrl = 'assets/img/shake banner.png';

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData && orgData.orgName) {
          this.org.orgName = orgData.orgName;
          this.org.language = orgData.language;
          this.org.logoUrl = orgData.logoURL;
          this.org.bannerUrl = orgData.bannerURL;
          this.rtl = this.org.language === 'he';
        }
      });

    this.route.queryParamMap.subscribe(params => {
      this.returnRoute = params.get('returnUrl');
      if (params.get('name')) {
        this.requestName = params.get('name').replace('+', ' ');
      }
      this.requestEmail = params.get('mail');

      if (this.returnRoute) {
        if (this.requestEmail) {
          this.queryParams = {
            returnUrl: this.returnRoute,
            name: this.requestName,
            mail: this.requestEmail
          };
        } else {
          this.queryParams = {
            returnUrl: this.returnRoute
          };
        }
      }
    });
  }

  login() {
    this.router.navigate([`org/${this.org.orgId}/login`], {queryParams: this.queryParams})
      .catch(err => console.log(err));

  }

  signup() {
    this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: this.queryParams})
      .catch(err => console.log(err));

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }


}
