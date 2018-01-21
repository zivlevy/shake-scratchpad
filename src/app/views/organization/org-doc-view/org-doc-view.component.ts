import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SkDoc} from '../../../model/document';
import {OrgService} from '../org.service';
import {Location} from '@angular/common';
import {OrgUser} from '../../../model/org-user';

@Component({
  selector: 'sk-org-doc-view',
  templateUrl: './org-doc-view.component.html',
  styleUrls: ['./org-doc-view.component.scss']
})
export class OrgDocViewComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentOrg: string;
  currentOrgUser: OrgUser;
  doc: SkDoc;
  isNumbering: boolean = true;

  constructor(private route: ActivatedRoute,
              private orgService: OrgService,
              public location: Location,
              public router: Router) {
  }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);

    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe( user => this.currentOrgUser = user);

    // get doc id from route params
    this.route.params
      .switchMap(params => {
        return this.orgService.getDoc$(params.docId);
      })
      .takeUntil(this.destroy$)
      .subscribe(doc => {
        this.doc = doc;
        console.log(doc);
      });
  }

  toggleNumbering() {
    this.isNumbering = !this.isNumbering;
  }

  gotoEdit() {
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.doc.uid]);
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
