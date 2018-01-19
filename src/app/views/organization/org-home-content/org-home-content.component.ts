import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AlgoliaService} from '../../../core/algolia.service';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {AlgoliaDoc} from "../../../model/algolia-doc";
import {SkDoc} from "../../../model/document";
import {FirestoreService} from "../../../core/firestore.service";

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

  searchResults: Array<AlgoliaDoc>;
  mainDisplay: string;
  selectedDoc: SkDoc;

  constructor(
    private orgService: OrgService,
    private algoliaService: AlgoliaService,
    private fs: FirestoreService) { }

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

    this.mainDisplay = 'messages';

  }

  // searchClicked(searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {
  //
  //   this.algoliaService.searchDocs(this.currentOrg, this.orgSearchKey, searchString, namesOnly, edited, published, versions)
  //     .then((res) => {
  //       this.searchResults1 = res;
  //       console.log('result ==', res);
  //     })
  //     .catch((err) => {
  //       console.log('some problem with search results', err);
  //     });
  // }

  getSearchResults(event) {
    this.mainDisplay = 'results';
    this.searchResults = event;
  }

  getSelectedDoc(event) {
    this.mainDisplay = 'doc';
    this.fs.doc$(`org/${this.currentOrg}/docs/${event.uid}`).take(1).subscribe((doc: SkDoc) => this.selectedDoc = doc)
    ;

  }
  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
