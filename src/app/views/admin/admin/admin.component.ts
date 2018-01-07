import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'sk-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(authUser => {
        this.currentUser = authUser;
      });
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
