import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import {takeUntil} from 'rxjs/operators';

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


  }

  ngOnInit() {
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

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
