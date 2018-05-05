import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../../core/auth.service';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;

  constructor(
    private router: Router,
    public authService: AuthService) {}

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
