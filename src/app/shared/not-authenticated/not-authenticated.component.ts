import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {LanguageService} from '../../core/language.service';
import {AuthService} from '../../core/auth.service';
import {ToasterService} from '../../core/toaster.service';

@Component({
  selector: 'sk-not-authenticated',
  templateUrl: './not-authenticated.component.html',
  styleUrls: ['./not-authenticated.component.scss']
})
export class NotAuthenticatedComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  direction: string = 'ltr';

  constructor(private lngService: LanguageService,
              private toasterService: ToasterService,
              private authService: AuthService) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);
  }

  ngOnInit() {
  }

  resend(){
    this.authService.sendEmailVerification()
      .then(() => {
        this.toasterService.toastSuccess('Mail Sent');
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
