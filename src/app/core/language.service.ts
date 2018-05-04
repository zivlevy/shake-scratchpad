import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  private languadge$: BehaviorSubject<string> = new BehaviorSubject('en');
  private direction$: BehaviorSubject<string> = new BehaviorSubject<string>('ltr');
  constructor(private translate: TranslateService) { }

  setLanguadge(lng) {
    document.getElementsByTagName('html')[0].setAttribute('dir', lng === 'he' ? 'rtl' : 'ltr' );
    lng === 'he' ? this.direction$.next('rtl') : this.direction$.next('ltr');
    this.languadge$.next(lng);
  }

  getLanguadge$ () {
    return this.languadge$.asObservable();
  }

  getDirection$ () {
    return this.direction$.asObservable();
  }
}
