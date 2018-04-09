import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../../core/language.service';
import 'rxjs/add/operator/takeUntil';
import {Org} from '../../../model/org';
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

  constructor(private orgService: OrgService,
              private media: ObservableMedia,
              route: ActivatedRoute,
              public router: Router,
              private lngService: LanguageService) { }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);

    // get current orgUser
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => this.currentOrgUser = user);

    this.org.bannerUrl = 'assets/img/shake banner.png';

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
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
      .takeUntil(this.destroy$)
      .subscribe(dir => this.rtl = (dir === 'rtl'));

    if (this.media.isActive('gt-sm')) {
      this.sideOpen = true;
      this.sideMode = 'side';
    } else {
      this.sideOpen = false;
      this.sideMode = 'over';
    }

    this.media.asObservable()
      .takeUntil(this.destroy$)
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
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docId, docType, docVersion, false, ''])
      .catch(err => console.log(err));
  }

  newDoc() {
    this.router.navigate([`org/${this.currentOrg}/org-doc-edit`, '', 'n', 0, 'false', '']);
  }

  treeDocClicked(ev) {
    // TODO change here to show correct doc version
    console.log(ev);
    if (ev.isPublish) {
      this.openDoc(ev.uid, 'p', '0');
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
