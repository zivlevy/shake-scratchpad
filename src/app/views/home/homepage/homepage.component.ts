import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {HomeService} from '../home.service';

@Component({
  selector: 'sk-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isAuthenticated: boolean;
  currentUser: any;
  version: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private homeService: HomeService,
              public authService: AuthService) {


  }

  ngOnInit() {
    this.version = environment.version;

    this.authService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(authUser => {
        this.currentUser = authUser;
      });
  }

  login() {
    this.router.navigate([`/login`])
      .catch(err => console.log(err));
  }

  signup() {
    this.router.navigate([`/register`])
      .catch(err => console.log(err));
  }

  appTest() {
    this.homeService.algoliaTest()
      .then(res => {
        console.log('Algolia is Ok');
      })
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
