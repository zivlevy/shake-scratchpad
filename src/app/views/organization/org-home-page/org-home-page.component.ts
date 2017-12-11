import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import {Subject} from 'rxjs/Subject';
import {OrgUser} from '../../../model/org-user';

@Component({
  selector: 'sk-org-home-page',
  templateUrl: './org-home-page.component.html',
  styleUrls: ['./org-home-page.component.scss']
})
export class OrgHomePageComponent implements OnInit, OnDestroy {
  logo: string;
  name: string;
  rtl = false;
  isAuthenticated = false;
  currentUser: OrgUser = null;
  currentOrg:string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private authService: AuthService) {



  }

  ngOnInit() {
    // get user info
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe((orgUser: OrgUser) => {
        console.log(orgUser);
        this.currentUser = orgUser;
      });

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.currentOrg = org;
      });

    // get user authentication
    this.authService.isAuth$()
      .takeUntil(this.destroy$)
      .subscribe(isAuth => this.isAuthenticated = isAuth);



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
    this.authService.setLanguadge(lng);
    this.rtl = lng === 'he' ? true : false;
  }

  login() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`login`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  logout() {
    const orgId = this.route.snapshot.params['id'];
    this.authService.logout();
    this.router.navigate([`org/${this.currentOrg}`]);
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
