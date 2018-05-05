import {Component, OnDestroy, OnInit} from '@angular/core';
import {MediaService} from '../../core/media.service';
import {Router} from '@angular/router';
import {OrgService} from '../../views/organization/org.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-screen-too-small',
  templateUrl: './screen-too-small.component.html',
  styleUrls: ['./screen-too-small.component.scss']
})
export class ScreenTooSmallComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  orgId: string;

  constructor(private mediaService: MediaService,
              private orgService: OrgService,
              private router: Router) { }

  ngOnInit() {
    // this.mediaService.getSmallScreen$()
    //   .subscribe(isSmallScreen => {
    //     if (!isSmallScreen) {
    //       if (this.orgId) {
    //         this.router.navigate([`org/${this.orgId}`])
    //           .catch(err => console.log(err));
    //       } else {
    //         this.router.navigate([``])
    //           .catch(err => console.log(err));
    //       }
    //
    //     }
    //   });
    //
    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(org => {
        this.orgId = org;
      });
  }

  home() {
    if (this.orgId) {
      this.router.navigate([`org/${this.orgId}`])
        .catch(err => console.log(err));
    } else {
      this.router.navigate([``])
        .catch(err => console.log(err));
    }
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
