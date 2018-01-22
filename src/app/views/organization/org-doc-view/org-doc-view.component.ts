import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sk-org-doc-view',
  templateUrl: './org-doc-view.component.html',
  styleUrls: ['./org-doc-view.component.scss']
})
export class OrgDocViewComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentOrg: string;
  currentOrgUser: OrgUser;
  currentDocId: string;
  currentDoc: SkDoc;
  currentDocType: string;
  currentDocVersion: number;
  currentEditData: SkDocData;
  isNumbering: boolean = true;

  constructor(private route: ActivatedRoute,
              private orgService: OrgService,
              public router: Router) {


  }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);
    // get current user
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => this.currentOrgUser = user);

    // get doc info from route params
    this.route.params
      .switchMap(params => {
        this.currentDocId = params.docId;
        this.currentDocType = params.docType;
        this.currentDocVersion = params.docVersion;
        return this.orgService.getDoc$(params.docId);
      })
      .switchMap( (doc: SkDoc) => {
        this.currentDoc = doc;
        if (this.currentDocType === 'p') {
          return Observable.of(doc.publishVersion);
        } else if (this.currentDocType === 'e') {
          return Observable.of(doc.editVersion);
        } else {
          return this.orgService.getDocVersion$(this.currentDoc.uid, this.currentDocVersion)
            .take(1);
        }
      })
      .takeUntil(this.destroy$)
      .subscribe((docData) => {
        this.currentEditData = docData;
      });
  }


  toggleNumbering() {
    this.isNumbering = !this.isNumbering;
  }
  goToOrgHome() {
    this.router.navigate([`org/${this.currentOrg}`]);
  }
  gotoEdit() {
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, this.currentDocType, this.currentDocVersion]);
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
