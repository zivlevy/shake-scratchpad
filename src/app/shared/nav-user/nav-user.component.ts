import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';

@Component({
  selector: 'sk-nav-user',
  templateUrl: './nav-user.component.html',
  styleUrls: ['./nav-user.component.scss']
})
export class NavUserComponent implements OnInit, OnDestroy {
  @Input() logoutRoute = '';
  currentAuthUser;
  currentSkUser;
  isAuthenticated: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private router: Router) {
    // init user info
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {

        this.currentAuthUser = user;
        this.isAuthenticated = user ? user.emailVerified : false;

      });

    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => this.currentSkUser = user);
  }


  logout() {
    console.log(this.logoutRoute)
    this.router.navigate([this.logoutRoute]);
    this.authService.logout();

  }
  ngOnInit() {
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
