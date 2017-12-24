import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {LanguageService} from '../../../core/language.service';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'sk-org-nav',
  templateUrl: './org-nav.component.html',
  styleUrls: ['./org-nav.component.scss']
})
export class OrgNavComponent implements OnInit, OnDestroy {
  logo: string;
  name: string;
  rtl = false;

  currentSkUser;
  isLoadingOrgUser = true;
  isAuthenticated = false;
  currentOrgUser: OrgUser = null;
  currentAuthUser;
  currentOrg: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private lngService: LanguageService,
              private authService: AuthService) { }

  ngOnInit() {

    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        console.log(user);
        this.currentSkUser = user;
      });

    // get current language
    this.lngService.getLanguadge$()
      .takeUntil(this.destroy$).
    subscribe(lng => {
      console.log(lng);
      this.rtl = lng === 'he' ? true : false;
    });

    // get current authenticatedUser
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.currentAuthUser = user;
        this.isAuthenticated =  user ? user.emailVerified : null;
      });

    // get user info
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        console.log(orgUser);
        console.log('endded');
        this.isLoadingOrgUser = false;
        this.currentOrgUser = orgUser;
      });

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.currentOrg = org;
      });

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.logo = orgData.logo;
          this.name = orgData.name;
        }
      });

  }

  setLang(lng) {
    this.lngService.setLanguadge(lng);
    this.rtl = lng === 'he' ? true : false;
  }

  login() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`org/${this.currentOrg}/login`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  signup() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`org/${this.currentOrg}/register`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  logout() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`org/${this.currentOrg}`]);
    this.authService.logout();

  }

  join() {
    this.orgService.joinToOrg();
  }

  gotoAdmin() {
    // this.router.navigate([`org/${this.currentOrg}/admin`]);
    this.router.navigate([`org/${this.currentOrg}/admin`]);
  }

  ngOnDestroy() {
    console.log('unsub =======');
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
