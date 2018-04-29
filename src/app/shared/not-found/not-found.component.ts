import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OrgService} from '../../views/organization/org.service';
import {Subject} from 'rxjs/Subject';

@Component({
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  orgId: string;

  constructor(private orgService: OrgService,
              private router: Router) { }

  ngOnInit() {
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.orgId = org;
      });
  }

  home() {
    if (this.orgId && this.orgId !== '_noOrg') {
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
