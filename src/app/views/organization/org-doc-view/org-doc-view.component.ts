import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject, of} from 'rxjs';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {LanguageService} from '../../../core/language.service';
import {OrgDocService} from '../org-doc.service';
import {AuthService} from '../../../core/auth.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {ToasterService} from '../../../core/toaster.service';
import {takeUntil, switchMap} from 'rxjs/operators';

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
  docVersionTitle: string = '';
  docVersionNumber: string = '';
  docName: string = '';
  isNumbering: boolean = true;
  isDocMap = false;
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
    // direction
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
    this.authService.getSkUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(skUser => {
        this.currentSkUser = skUser;
      });

    // get doc info from route params
    this.route.params
      .switchMap(params => {
        this.currentDocId = params.docId;
        this.currentDocType = params.docType;
        this.currentDocVersion = params.docVersion;
        this.searchPhrase = params.searchPhrase === '**' ? '' : params.searchPhrase;
        this.isSearch = params.isSearch === 'true';
        return this.orgService.getDoc$(params.docId);
      }).pipe(
      switchMap( (doc: SkDoc) => {
        this.orgDocService.isSignatureRequired$(this.currentOrg, this.currentSkUser.uid, this.currentDocId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(reqDocAckId => {
            this.docAckId = reqDocAckId;
          });
        if (doc) {
          this.docName = doc.name;
        }
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
      })
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe((docData) => {
        this.currentEditData = docData;
      });
  }


  toggleNumbering() {
    this.isNumbering = !this.isNumbering;
  }

  toggleMapView() {
    this.isDocMap = !this.isDocMap;
  }

  printDoc() {
    let printContents, popupWin;
    printContents = document.getElementById('doc-body').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>`);
    if (this.rtl) {
      popupWin.document.write('* {direction: rtl; margin-right: 10px; margin-left:10px}');
    } else {
      popupWin.document.write('* {direction: ltr}');
    }
    popupWin.document.write(`
          .section {  font-size: 18px; font-weight: bold;}
          .item-warning {color: red}
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();

  }

  toggleSectionView() {
    this.isTaskView = !this.isTaskView;
    if (this.isTaskView) {
      this.isSearch = false;
      this.searchPhrase = '';
    }
  }

  goToOrgHome() {
    this.router.navigate([`org/${this.currentOrg}`])
      .catch(err => console.log(err));
  }

  gotoEdit() {
    if (!this.searchPhrase) {
      this.searchPhrase = '**';
    }
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, this.currentDoc.uid, this.currentDocType, this.currentDocVersion, this.isSearch, this.searchPhrase])
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
