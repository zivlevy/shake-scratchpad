import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {OrgUser} from '../../../model/org-user';
import {LanguageService} from '../../../core/language.service';
import {Org} from '../../../model/org';
import {ImageService} from '../../../core/image.service';
import {User} from '../../../model/user';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'sk-org-home-page',
  templateUrl: './org-home-page.component.html',
  styleUrls: ['./org-home-page.component.scss']
})
export class OrgHomePageComponent implements OnInit, OnDestroy {
  org: Org = new Org();
  user: User = new User();

  rtl = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private lngService: LanguageService,
              private authService: AuthService,
              private imageService: ImageService,
              ) {}

  ngOnInit() {

    this.user.isLoadingOrgUser = true;
    this.user.isAuthenticated = false;

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        // console.log(user);
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
        this.org.orgId = org;
        this.org.orgHome = '/org/' + org;
      });

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          console.log('org data change', orgData);
          this.org.orgName = orgData.orgName;
        }
      });

    // get org private data
    this.orgService.getOrgPrivateData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.org.orgSearchKey = orgData.searchKey;
        }
      });

    // default logo
    this.org.logoUrl = 'assets/img/shake-logo/logo_no_text.svg';

    this.imageService.getOrgLogo$(this.org.orgId)
      .subscribe(
        (url) => this.org.logoUrl = url,
        (err) => console.log('Error: ' + err));

  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
