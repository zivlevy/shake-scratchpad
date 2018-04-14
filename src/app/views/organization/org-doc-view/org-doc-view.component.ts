import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {Observable} from 'rxjs/Observable';
import {LanguageService} from '../../../core/language.service';
import {OrgDocService} from '../org-doc.service';
import {AuthService} from '../../../core/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {ToasterService} from '../../../core/toaster.service';
import 'rxjs/add/operator/takeUntil';
@Component({
  selector: 'sk-org-doc-view',
  templateUrl: './org-doc-view.component.html',
  styleUrls: ['./org-doc-view.component.scss']
})
export class OrgDocViewComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentOrg: string;
  currentOrgUser: OrgUser;
  currentSkUser;
  currentDocId: string;
  currentDoc: SkDoc;
  currentDocType: string;
  currentDocVersion: number;
  currentEditData: SkDocData;
  docVersiontitle: string = '';
  isNumbering: boolean = true;
  searchPhrase: string = '';
  isSearch: boolean = false;
  rtl: boolean = false;

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  docAckId: string = null;
  isTaskView: boolean = false;
  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private orgService: OrgService,
              private orgDocService: OrgDocService,
              public router: Router,
              private dialog: MatDialog,
              private toaster: ToasterService,
              private lngService: LanguageService) {


  }

  ngOnInit() {
    // direcrtion
    this.lngService.getDirection$()
      .takeUntil(this.destroy$)
      .subscribe(dir => this.rtl = (dir === 'rtl'));

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);
    // get current user
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => this.currentOrgUser = user);
    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(skUser => this.currentSkUser = skUser);

    // get doc info from route params
    this.route.params
      .switchMap(params => {
        this.currentDocId = params.docId;
        this.currentDocType = params.docType;
        this.currentDocVersion = params.docVersion;
        this.searchPhrase = params.searchPhrase === '**' ? '' : params.searchPhrase;
        this.isSearch = params.isSearch === 'true';
        return this.orgService.getDoc$(params.docId);
      })
      .switchMap( (doc: SkDoc) => {
        this.orgDocService.isSignatureRequired$(this.currentOrg, this.currentSkUser.uid, this.currentDocId)
          .takeUntil(this.destroy$)
          .subscribe(reqDocAckId => {
            this.docAckId = reqDocAckId;
          });
        console.log(this.currentOrg, this.currentOrgUser, this.currentDocId, this.currentSkUser.uid);
        this.currentDoc = doc;
        if (this.currentDocType === 'p') {
          this.docVersiontitle = `Published version ${doc.version}`;
          return Observable.of(doc.publishVersion);
        } else if (this.currentDocType === 'e') {
          this.docVersiontitle = `Edit version`;
          return Observable.of(doc.editVersion);
        } else {
          this.docVersiontitle = `Archive version ${this.currentDocVersion}`;
          return this.orgService.getDocVersion$(this.currentDoc.uid, this.currentDocVersion )
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

  toggleTaskView() {
    this.isTaskView = !this.isTaskView;
  }

  goToOrgHome() {
    this.router.navigate([`org/${this.currentOrg}`])
      .catch(err => console.log(err));
  }

  gotoEdit() {
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, this.currentDocType, this.currentDocVersion, 'false', ''])
      .catch(err => console.log(err));
  }

  toggleSearch() {
    this.isSearch = ! this.isSearch;
  }

  signDocument() {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Sign Document Read ?'
      }
    });

    this.confirmDialogRef.afterClosed()
      .subscribe(res => {
        if (res) {
          this.orgDocService.userDocAckSign(this.currentOrg, this.currentSkUser.uid, this.docAckId)
            .then(() => {
              this.toaster.toastInfo('Document signature acknowledged.');
              this.docAckId = null;
            })
            .catch(err => console.log(err));
        }
      });

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
