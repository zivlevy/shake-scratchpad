import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, Observable, of} from 'rxjs';
import {OrgUser} from '../../../model/org-user';
import {LanguageService} from '../../../core/language.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {PublishDialogComponent} from '../dialogs/publish-dialog/publish-dialog.component';

import {filter, takeUntil, switchMap} from 'rxjs/operators';

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
  docVersionTitle: string = '';
  docVersionNumber: string = '';
  docName: string = '';

  isPreview: boolean = false;
  previewData: string;
  isSaving: boolean;
  isNumbering: boolean = false;
  rtl: boolean = false;
  isTaskView: boolean = false;
  // dialogs
  publishDialogRef: MatDialogRef<PublishDialogComponent>;

  searchPhrase: string = '';
  isSearch: boolean = false;

  constructor(public orgService: OrgService,
              private route: ActivatedRoute,
              private router: Router,
              private lngService: LanguageService,
              private dialog: MatDialog) {


  }

  ngOnInit() {

    // direcrtion
    this.lngService.getDirection$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dir => this.rtl = (dir === 'rtl'));


    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => this.currentOrg = org);

    // get current user
    this.orgService.getOrgUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentOrgUser = user);

    // get doc info from route params
    this.route.params
      .pipe(
        switchMap(params => {
          this.currentDocId = params.docId;
          this.currentDocType = params.docType;
          this.currentDocVersion = params.docVersion;
          this.searchPhrase = params.searchPhrase === '**' ? '' : params.searchPhrase;
          this.isSearch = params.isSearch === 'true';
          if (params.docType === 'n') {
            return of(null);
          } else {
            return this.orgService.getDoc$(params.docId);
          }
        }),
        switchMap((doc: SkDoc | null) => {
          if (doc) {
            this.docName = doc.name;
            this.currentDoc = doc;
            if (this.currentDocType === 'p') {
              this.docVersionTitle = 'Version';
              this.docVersionNumber = String(doc.version);

              return of(doc.publishVersion);
            } else if (this.currentDocType === 'e') {
              this.docVersionTitle = `Edit version`;
              this.docVersionNumber = '';
              return of(doc.editVersion);
            } else {
              this.docVersionTitle = `Archive version`;
              this.docVersionNumber = String(this.currentDocVersion);
              return this.orgService.getDocVersion$(this.currentDoc.uid, this.currentDocVersion )
                .take(1);
            }
          } else {
            // this is a new doc
            this.docVersionTitle = 'New doc';
            this.currentDoc = null;
            this.editor.newDoc();
            return of(null);
          }
        })
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((docData) => {
        if (docData) {
          this.currentEditData = docData;
        }
      });

  }



  saveDocument() {
    this.isSearch = false;
    const docData = this.editor.getDoc( true);
    if (this.currentDoc && this.currentDoc.uid) {
      this.orgService.saveDoc(this.currentDoc.uid, docData)
        .then(() => {
          // go to edit of new version
          this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, 'e', 0, 'false', '**'])
            .then(() => this.isSaving = false);
        });
    } else {
      this.isSaving = true;
      this.orgService.addDoc(docData)
        .then((docId: any) => {
          // go to edit of new version
          this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, docId, 'e', 0, 'false', '**']);
          this.isSaving = false;
        })
        .catch(err => {
          console.log(err);
          this.isSaving = false;
        });
    }
  }

  publishDocument() {
    this.isSearch = false;
    const docData = this.editor.getDoc(true);
    if (this.currentDoc && this.currentDoc.uid) {
      this.publishDialogRef = this.dialog.open(PublishDialogComponent);

      this.publishDialogRef
        .afterClosed()
        .pipe(filter(answer => answer))
        .subscribe(name => {
          this.isSaving = true;
          this.orgService.publishDoc(this.currentDoc.uid, docData, name === 'publish')
            .then(() => {
              // go to edit of new version
              this.router.navigate([`org/${this.currentOrg}`]);
              this.isSaving = false;
            })
            .catch((err) => console.log(err));
        });

    } else {
      this.orgService.addDoc(docData)
        .then((docId) => {
          this.orgService.publishDoc(docId, docData)
            .then(() => {
              // go to edit of new version
              this.router.navigate([`org/${this.currentOrg}`]);
              this.isSaving = false;
            })
            .catch((err) => console.log(err));
        });
    }
  }


  toggleSearch() {
    this.isSearch = ! this.isSearch;
  }

  goToOrgHome() {
    this.router.navigate([`org/${this.currentOrg}`]);
  }

  showPreview() {
    const docData = this.editor.getDoc();
    this.previewData = docData.data;
    this.isPreview = true;
  }


  toggleNumbering() {
    this.isNumbering = !this.isNumbering;
  }

  toggleSectionView() {
    this.isTaskView = !this.isTaskView;
    if (this.isTaskView) {
      this.isSearch = false;
      this.searchPhrase = '';
    }
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

  editTreeClicked(){
    this.isSearch = false;
  }
}
