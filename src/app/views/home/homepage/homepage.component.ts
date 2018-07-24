import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import { AuthService } from '../../../core/auth.service';
import {takeUntil} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {HomeService} from '../home.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {InfoDialogComponent} from '../../../shared/dialogs/info-dialog/info-dialog.component';

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

  infoDialogRef: MatDialogRef<InfoDialogComponent>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private homeService: HomeService,
              private dialog: MatDialog,
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


    const algoliaTest = this.homeService.algoliaTest();
    const lines = [];

    Promise.all([algoliaTest])
      .then(res => {
        console.log(res);
        if (res[0]) {
          lines.push('Algolia is Ok');
        } else {
          lines.push('Algolia com problem');
        }
        // console.log(res, 'Algolia is Ok');
        this.infoDialogRef = this.dialog.open(InfoDialogComponent, {
          data: {
            header: 'API Test',
            lines: lines
          }
        });
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
