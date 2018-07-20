import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../../core/language.service';

import {Org} from '../../../model/org';
import {takeUntil} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {SelectDialogComponent} from '../../../shared/dialogs/select-dialog/select-dialog.component';
import {DocAck} from '../../../model/document';
import {DocumentService} from '../../document/document.service';
import {ToasterService} from '../../../core/toaster.service';

@Component({
  selector: 'sk-org-home',
  templateUrl: './org-home.component.html',
  styleUrls: ['./org-home.component.scss']
})
export class OrgHomeComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentOrg: string;
  currentOrgUser: OrgUser;
  org: Org = new Org();

  rtl: boolean = false;

  activeMediaQuery = '';
  sideOpen: boolean = true;
  sideMode: string = 'side';

  selectDialogRef: MatDialogRef<SelectDialogComponent>;
  selectedTab = 0;

  constructor(private orgService: OrgService,
              private docService: DocumentService,
              private media: ObservableMedia,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: MatDialog,
              private toasterService: ToasterService,
              private lngService: LanguageService) { }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => this.currentOrg = org);

    this.orgService.getOrgUserDocAcks$()
      .subscribe((res: DocAck[]) => {
        this.selectedTab = res.length ? 1 : 0;
      });

    // get current orgUser
    this.orgService.getOrgUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentOrgUser = user);

    this.org.bannerUrl = 'assets/img/shake banner.png';

    // get org public data
    this.orgService.getOrgPublicData$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgData => {
        if (orgData && orgData.orgName) {
          this.org.orgName = orgData.orgName;
          this.org.language = orgData.language;
          this.org.logoUrl = orgData.logoURL;
          this.org.bannerUrl = orgData.bannerURL;
        }
      });

    // directions
    this.lngService.getDirection$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(dir => this.rtl = (dir === 'rtl'));

    if (this.media.isActive('gt-sm')) {
      this.sideOpen = true;
      this.sideMode = 'side';
    } else {
      this.sideOpen = false;
      this.sideMode = 'over';
    }

    this.media.asObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe((change: MediaChange) => {
        if (change.mqAlias !== 'xs' && change.mqAlias !== 'sm') {
          this.sideOpen = true;
          this.sideMode = 'side';
        } else {
          this.sideOpen = false;
          this.sideMode = 'over';
        }
        this.activeMediaQuery = change.mqAlias;
      });
  }

  openDoc(docId: string, docType: string, docVersion: string) {
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docId, docType, docVersion, false, '**'])
      .catch(err => console.log(err));
  }

  newDoc() {
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, '', 'n', 0, 'false', '**']);
  }

  getWordDoc(event) {
    const inFile = event.target.files[0];
    this.toasterService.toastInfo('Document import started', 1000);
    this.docService.importWordDoc(inFile)
      .subscribe(res => {
        this.toasterService.toastSuccess('Document import succeeded');
        const name = inFile.name.toString().slice(0, -5);
        const docToSave = this.docService.prepareDocToSave([{data: name, nodes: res.nodes}]);
        this.orgService.addDoc(docToSave);
    }, err => {
        this.toasterService.toastError('Document import failed');
      });

  }

  treeDocClicked(ev) {
    if (ev.isPublish) {
        if (ev.isEditDirty) {
        this.selectDialogRef = this.dialog.open(SelectDialogComponent, {
          data: {
            msg: 'Which Document to open ?'
          }
        });
        this.selectDialogRef.afterClosed()
          .subscribe(result => {
            if (result === 'edit') {
              this.openDoc(ev.uid, 'e', '0');
            } else {
              this.openDoc(ev.uid, 'p', '0');
            }
          });
      } else {
        this.openDoc(ev.uid, 'p', '0');
      }
    } else {
      this.openDoc(ev.uid, 'e', '0');
    }
  }
  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
