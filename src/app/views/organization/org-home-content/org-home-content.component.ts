import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlgoliaService} from '../../../core/algolia.service';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'sk-org-home-content',
  templateUrl: './org-home-content.component.html',
  styleUrls: ['./org-home-content.component.scss']
})
export class OrgHomeContentComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  orgSearchKey: string;
  orgName: string;
  currentOrg: string;
  searchResults = new Array<any>();

  constructor(
    private orgService: OrgService,
    private algoliaService: AlgoliaService) { }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.currentOrg = org;
      });

    // get org public data
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.orgName = orgData.orgName;
        }
      });

    // get org private data
    this.orgService.getOrgPrivateData$()
      .takeUntil(this.destroy$)
      .subscribe(orgData => {
        if (orgData) {
          this.orgSearchKey = orgData.searchKey;
        }
      });

    // test TODO remove
    // this.orgService.getAllDocs$()
    //   .subscribe(docs => {
    //     console.log(docs);
    //     this.orgService.getDoc$(docs[0].uid)
    //       .subscribe(doc => { console.log( doc); });
    //   });
    //
    // this.orgService.addDoc({ name: 'the name of me'})
    //   .then(res => {
    //     console.log(res);
    //     // this.orgService.deleteDoc(res.id);
    //
    //   });
  }

  searchNamesClicked(searchString: string) {
    // get Algolia search results
    this.orgSearchKey = 'ce92e39e78c39981be8c2946500374b4';
    // this.algoliaService.getSearchResults(this.currentOrg, this.orgSearchKey, searchString)
    this.algoliaService.getCurrentDocsByNames('test', 'ce92e39e78c39981be8c2946500374b4', searchString)
      .then((res) => {
        this.searchResults = res;
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }

  searchCurrentClicked(searchString: string) {
    // get Algolia search results
    this.orgSearchKey = 'ce92e39e78c39981be8c2946500374b4';
    // this.algoliaService.getSearchResults(this.currentOrg, this.orgSearchKey, searchString)
    this.algoliaService.getCurrentDocsByAnyField('test', 'ce92e39e78c39981be8c2946500374b4', searchString)
      .then((res) => {
        this.searchResults = res;
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }

  searchHistoryClicked(searchString: string) {
    // get Algolia search results
    this.orgSearchKey = 'ce92e39e78c39981be8c2946500374b4';
    // this.algoliaService.getSearchResults(this.currentOrg, this.orgSearchKey, searchString)
    this.algoliaService.getHistoryDocsByAnyField('test', 'ce92e39e78c39981be8c2946500374b4', searchString)
      .then((res) => {
        this.searchResults = res;
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }
  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

  uploadClicked(docName, docText, docFormattedText) {
    this.orgService.uploadDocument(docName, docText, docFormattedText);
  }
}
