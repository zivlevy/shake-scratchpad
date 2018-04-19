import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MediaService {
  private smallScreen$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private media: ObservableMedia) {

    this.media.asObservable()
      .subscribe((mediaChange: MediaChange) => {
        if (mediaChange.mqAlias === 'xs' || mediaChange.mqAlias === 'sm') {
          this.smallScreen$.next(true);
        } else {
          this.smallScreen$.next(false);
        }
      });
  }
  getSmallScreen$(): Observable<boolean> {
    return this.smallScreen$.asObservable();
  }
}
