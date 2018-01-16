import {Component, Input, OnInit, Output} from '@angular/core';
import {AlgoliaService} from '../../../core/algolia.service';
import {AlgoliaDoc} from '../../../model/algolia-doc';

@Component({
  selector: 'sk-org-search-panel',
  templateUrl: './org-search-panel.component.html',
  styleUrls: ['./org-search-panel.component.scss']
})
export class OrgSearchPanelComponent implements OnInit {

  @Input()
  currentOrg;

  @Input()
  orgSearchKey;

  @Output()
  searchResults = new Array<AlgoliaDoc>();



  constructor(private algoliaService: AlgoliaService) { }

  ngOnInit() {
  }

  searchClicked(searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {

    this.algoliaService.searchDocs(this.currentOrg, this.orgSearchKey, searchString, namesOnly, edited, published, versions)
      .then((res) => {
        this.searchResults = res;
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }
}
