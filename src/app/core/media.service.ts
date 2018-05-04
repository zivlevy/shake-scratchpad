import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

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
