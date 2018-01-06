import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  private languadge$: BehaviorSubject<string> = new BehaviorSubject('en');
  constructor(private translate: TranslateService) { }

  setLanguadge(lng) {
    document.getElementsByTagName('html')[0].setAttribute('dir', lng === 'he' ? 'rtl' : 'ltr' );
    this.languadge$.next(lng);
  }

  getLanguadge$ () {
    return this.languadge$.asObservable();
  }
}
