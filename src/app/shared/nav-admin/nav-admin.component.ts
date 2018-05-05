import {Component, OnDestroy, OnInit} from '@angular/core';
import {LanguageService} from '../../core/language.service';
import {Subject} from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-nav-admin',
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.scss']
})
export class NavAdminComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  rtl = false;
  isSkAdmin = false;
  isSkEditor = false;
  currentAuthUser;

  constructor(private authService: AuthService,
    private lngService: LanguageService) { }

  ngOnInit() {
    // get current language
    this.lngService.getLanguadge$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(lng => {
      console.log(lng);
      this.rtl = lng === 'he';
    });

    // init user info
    this.authService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {

        this.currentAuthUser = user;
        if (user === null) {
          this.isSkEditor = false;
          this.isSkAdmin = false;
          return null;
        }
        this.authService.isSkAdmin$(user.uid)
          .subscribe(res => {
            this.isSkAdmin = res;
          });

        this.currentAuthUser = user;
        this.authService.isSkEditor$(user.uid)
          .subscribe(res => {
            this.isSkEditor = res;
          });
      });


  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
