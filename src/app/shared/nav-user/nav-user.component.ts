import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {LanguageService} from '../../core/language.service';
import {takeUntil} from 'rxjs/operators';
import {OrgService} from '../../views/organization/org.service';

@Component({
  selector: 'sk-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.scss']
})
export class NavUserComponent implements OnInit, OnDestroy {
  // @Input() logoutRoute = '';
  currentAuthUser;
  currentSkUser;
  currentLng;
  isAuthenticated: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  myOrgs: Array<any>; // = new Array<any>();
  myDir: string = 'rtl';
  homeRoute: string;
  orgId: string;

  constructor(private authService: AuthService,
              private router: Router,
              private orgService: OrgService,
              public lngService: LanguageService) {}

  ngOnInit() {
    this.lngService.getLanguadge$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lng => {
        this.currentLng = lng;
         if (lng === 'en') {
           this.myDir = 'ltr';
         } else {
           this.myDir = 'rtl';
         }
      } );

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

    // init user info
    this.authService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {

        this.currentAuthUser = user;
        this.isAuthenticated = user ? user.emailVerified : false;

      });

    this.authService.getSkUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentSkUser = user;
        if (user === null) {
          return null;
        }
        this.authService.getUserOrgs$(user.uid)
          .subscribe(res => {
            this.myOrgs = [];
            res.forEach(org => {
              this.myOrgs.push({
                'id': org.id,
                'name': org.orgName
              });
            });
          });
      });
  }

  logout() {
    this.authService.logout()
      .catch(err => console.log(err));

    this.router.navigate([this.homeRoute + '/login'])
      .catch(err => console.log(err));

    // if (this.logoutRoute === '') {
    //   this.router.navigate(['login'])
    //     .catch(err => console.log(err));
    // } else {
    //   this.router.navigate([this.logoutRoute])
    //     .catch(err => console.log(err));
    // }
  }

  orgClicked(orgId: string) {
    this.router.navigate(['org/' + orgId])
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
