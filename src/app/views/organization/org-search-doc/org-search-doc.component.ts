import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {OrgUser} from '../../../model/org-user';
import {Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/fromEvent';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ToasterService} from '../../../core/toaster.service';

@Component({
  selector: 'sk-org-search-doc',
  templateUrl: './org-search-doc.component.html',
  styleUrls: ['./org-search-doc.component.scss']
})
export class OrgSearchDocComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentOrg: string;
  currentOrgUser: OrgUser;

  searchTerm = '';
  docNameOnly: boolean = false;
  published: boolean = true;
  edited: boolean = false;
  version: boolean = false;
  checkboxClick$: Subject<any> = new Subject();
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  @ViewChild('search') searchInput: ElementRef;

  documents: any[];

  constructor(private orgService: OrgService,
              private router: Router,
              private dialog: MatDialog,
              private toaster: ToasterService) { }

  ngOnInit() {

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);

    // get current orgUser
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => this.currentOrgUser = user);

    Observable.merge(
      this.checkboxClick$.asObservable(),
      Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
        .debounceTime(500)
        .distinctUntilChanged())
      .switchMap(() => {
        return Observable.fromPromise(this.filterDocumentsByTerm());
      }).subscribe((res: any) => this.documents = res);
  }

  filterDocumentsByTerm() {
    const value = this.searchTerm;
    if (value !== '' && (this.edited || this.published || this.version) ) {
      return this.orgService.searchDocsByTerm(value, this.docNameOnly, this.edited, this.published, this.version);
    } else {
      return Promise.resolve([]);
    }
  }

  openDoc(docId: string, docType: string, docVersion: string) {
    let isSearch = true;
    if (this.searchTerm === '*') {
      isSearch = false;
      this.searchTerm = '**';
    }
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docId, docType, docVersion, isSearch, this.searchTerm ])
      .catch(err => console.log(err));
  }

  editDoc(docId: string, docType: string, docVersion: string) {
    let isSearch = true;
    if (this.searchTerm === '*') {
      isSearch = false;
      this.searchTerm = '**';
    }
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, docId, docType, docVersion, isSearch, this.searchTerm])
      .catch(err => console.log(err));
  }

  deleteDocVersion(docId: string, docType: string, docVersion: string) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Delete ?'
      }
    });

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.orgService.deleteDocVersion(docId, docVersion)
            .then(() => {
              this.toaster.toastInfo('Document deletion succeeded');
              setTimeout(() => this.checkboxClick$.next(), 1500);
              setTimeout(() => this.checkboxClick$.next(), 3000);
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
