import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {SkDoc} from '../../../model/document';
import {OrgService} from '../org.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import {Subject} from 'rxjs/Subject';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Router} from '@angular/router';
import {OrgUser} from '../../../model/org-user';

@Component({
  selector: 'sk-org-search-docs',
  templateUrl: './org-search-docs.component.html',
  styleUrls: ['./org-search-docs.component.scss']
})
export class OrgSearchDocsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  activeMediaQuery = '';
  sideMode: string = 'side';
  sideOpen: boolean = true;
  @ViewChild('search') searchInput: ElementRef;

  documents: any[];
  // search related
  searchTerm = '';
  docNameOnly: boolean = false;
  published: boolean = true;
  edited: boolean = false;
  version: boolean = false;
  checkboxClick$: Subject<any> = new Subject();

  currentOrg: string;
  currentOrgUser: OrgUser;

  constructor(private orgService: OrgService,
              public media: ObservableMedia,
              public route: ActivatedRoute,
              public router: Router) {

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);

    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe( user => this.currentOrgUser = user);



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

  ngOnInit() {

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
    if (value !== '') {
      return this.orgService.serachDocsByTerm(value, this.docNameOnly, this.edited, this.published, this.version);
    } else {
      return Promise.resolve([]);
    }
  }

  toogleMenu() {
    this.sideOpen = !this.sideOpen;
  }

  openDoc(docId: string, docType: string, docVersion: string) {
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docId, docType, docVersion]);
  }

  treeDocClicked(ev) {
    console.log(ev);
    this.openDoc(ev.uid, 'p', '0');
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
