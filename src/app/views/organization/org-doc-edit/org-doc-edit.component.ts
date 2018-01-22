import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {OrgUser} from '../../../model/org-user';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'sk-org-doc-edit',
  templateUrl: './org-doc-edit.component.html',
  styleUrls: ['./org-doc-edit.component.scss']
})
export class OrgDocEditComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('editor') editor;
  currentOrg: string;
  currentOrgUser: OrgUser;
  currentDocId: string;
  currentDoc: SkDoc;
  currentDocType: string;
  currentDocVersion: number;
  currentEditData: SkDocData;
  isDirty: boolean = false;

  isPreview: boolean = false;
  previewData: string;
  isSaving: boolean;

  constructor(public orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router) {


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
      .switchMap((doc: SkDoc) => {
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


  saveDocument() {
    const docData = this.editor.getDoc();
    if (this.currentDoc && this.currentDoc.uid) {
      this.orgService.saveDoc(this.currentDoc.uid, docData)
        .then(res => {
          // go to edit of new version
          this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, 'e', 0])
          this.isSaving = false;
        });
    } else {
      this.isSaving = true;
      this.orgService.addDoc(docData).then((res) => {
        // go to edit of new version
        this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, 'e', 0])
        this.isSaving = false;
      })
        .catch(err => {
          console.log(err);
          this.isSaving = false;
        });
    }
  }

  publishDocument() {
    const docData = this.editor.getDoc();
    if (this.currentDoc && this.currentDoc.uid) {
      this.isSaving = true;
      this.orgService.publishDoc(this.currentDoc.uid, docData)
        .then(() => {
          // go to edit of new version
          this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, 'e', 0]);
          this.isSaving = false;
        })
        .catch((err) => console.log(err));
    } else {
      this.orgService.addDoc(docData)
        .then((doc) => {
          this.orgService.publishDoc(doc.id, docData)
            .then(() => {
              // go to edit of new version
              this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, 'e', 0]);
              this.isSaving = false;
            })
            .catch((err) => console.log(err));
        });
    }
  }

  goToOrgHome() {
    this.router.navigate([`org/${this.currentOrg}`]);
  }

  showPreview() {
    const docData = this.editor.getDoc();
    this.previewData = docData.data;
    this.isPreview = true;

    // this.router.navigate([`org/${this.currentOrg}/org-doc-view`, this.currentDoc.uid, this.currentDoc.uid, this.currentDocType, this.currentDocVersion]);
  }

  showEdit() {
    this.isPreview = false;
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
