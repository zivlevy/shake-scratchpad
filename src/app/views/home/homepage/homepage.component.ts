import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'sk-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isAuthenticated: boolean;
  currentUser: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService) {

    this.authService.getUser$()
      // .takeUntil(this.destroy$)
      .subscribe(authUser => {
        this.currentUser = authUser;
      });
  }

  ngOnInit() {

  }

  login() {
    this.router.navigate([`/login`]);
  }

  signup() {
    this.router.navigate([`/register`]);
  }

  logout() {
    this.authService.logout();
  }

  addOrganization(){
    this.router.navigate([`add-org`]);
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
