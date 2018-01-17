import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AlgoliaDoc} from "../../../model/algolia-doc";
import {SkDoc} from "../../../model/document";

@Component({
  selector: 'sk-org-search-results',
  templateUrl: './org-search-results.component.html',
  styleUrls: ['./org-search-results.component.scss']
})
export class OrgSearchResultsComponent implements OnInit {

  @Input()
  searchResults: Array<AlgoliaDoc>;

  @Output()
  selectedDoc: EventEmitter<SkDoc> = new EventEmitter() ;

  constructor() { }

  ngOnInit() {
  }

  resultClicked(result: AlgoliaDoc) {
    const doc = new SkDoc();
    doc.name = result.name;
    doc.uid = result.docId;
    this.selectedDoc.emit(doc);
  }
}
