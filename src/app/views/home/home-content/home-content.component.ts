import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../../core/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(authUser => {
        this.currentUser = authUser;
      });
  }

  login() {
    this.router.navigate([`login`], {queryParams: {returnUrl: '/'}})
      .catch(err => console.log(err));
  }

  addOrganization(){
    this.router.navigate([`add-org`])
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
