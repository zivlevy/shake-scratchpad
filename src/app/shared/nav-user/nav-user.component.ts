import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';
import {LanguageService} from '../../core/language.service';
import {OrgService} from '../../views/organization/org.service';

@Component({
  selector: 'sk-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.scss']
})
export class NavUserComponent implements OnInit, OnDestroy {
  @Input() logoutRoute = '';
  currentAuthUser;
  currentSkUser;
  currentLng;
  isAuthenticated: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  myOrgs: Array<any>; // = new Array<any>();

  constructor(private authService: AuthService,
              private router: Router,
              public lngService: LanguageService,
              private orgService: OrgService) {}

  ngOnInit() {
    this.lngService.getLanguadge$()
      .takeUntil(this.destroy$)
      .subscribe(lng => this.currentLng = lng );

    // init user info
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {

        this.currentAuthUser = user;
        this.isAuthenticated = user ? user.emailVerified : false;

      });

    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
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
              // this.orgService.getOrgNameP(orgIdObj.id)
              //   .then(orgName => {
              //
              //   });
            });
          });
      });
  }

  logout() {
    console.log(this.logoutRoute);
    this.router.navigate([this.logoutRoute])
      .catch(err => console.log(err));
    this.authService.logout();
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
