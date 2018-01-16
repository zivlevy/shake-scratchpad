import {Component, Input, OnInit} from "@angular/core";
import {AlgoliaDoc} from "../../../model/algolia-doc";

@Component({
  selector: 'sk-org-search-results',
  templateUrl: './org-search-results.component.html',
  styleUrls: ['./org-search-results.component.scss']
})
export class OrgSearchResultsComponent implements OnInit {

  @Input()
  searchResults: Array<AlgoliaDoc>;

  constructor() { }

  ngOnInit() {
  }

}
