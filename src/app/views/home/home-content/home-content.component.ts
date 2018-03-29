import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'sk-home-content',
  templateUrl: './home-content.component.html',
  styleUrls: ['./home-content.component.scss']
})
export class HomeContentComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  isAuthenticated: boolean;
  currentUser: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService) {


  }

  ngOnInit() {
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(authUser => {
        this.currentUser = authUser;
      });
  }

  login() {
    this.router.navigate([`login`], {queryParams: {returnUrl: '/'}});
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
