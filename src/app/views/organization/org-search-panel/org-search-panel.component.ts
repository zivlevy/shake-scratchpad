import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AlgoliaService} from '../../../core/algolia.service';
import {AlgoliaDoc} from '../../../model/algolia-doc';
import {OrgService} from "../org.service";

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
  searchResults: EventEmitter<Array<AlgoliaDoc>> = new EventEmitter() ;
  orgDocs$;



  constructor(private algoliaService: AlgoliaService,
              private orgService: OrgService) { }

  ngOnInit() {
    this.orgDocs$ = this.orgService.getAllDocs$();

  }

  searchClicked(searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {

    this.algoliaService.searchDocs(this.currentOrg, this.orgSearchKey, searchString, namesOnly, edited, published, versions)
      .then((res) => {
        this.searchResults.emit(res);
        console.log('result ==', res);
      })
      .catch((err) => {
        console.log('some problem with search results', err);
      });
  }
}
