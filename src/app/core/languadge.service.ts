import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class LanguadgeService {
  private languadge$: BehaviorSubject<string> = new BehaviorSubject('en');
  constructor(private translate: TranslateService) { }

  setLanguadge(lng) {
    this.languadge$.next(lng);
  }

  getLanguadge$ () {
    return this.languadge$.asObservable();
  }
}
