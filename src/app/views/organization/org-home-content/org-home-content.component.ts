import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {AlgoliaService} from '../../../core/algolia.service';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {AlgoliaDoc} from "../../../model/algolia-doc";

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

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
