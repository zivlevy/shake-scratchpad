import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SkDoc, SkDocData, SkItem, SkSection, SK_ITEM_TYPE} from '../../../model/document';
import {DocumentService} from '../document.service';
@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit, OnChanges {
  @Input() isRTL: boolean;
  @Input() isNumbering: boolean = true;
  @Input() docJson: string;
  @Input() ident: number = 10;
  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = true;
  docList: Array<SkSection | SkItem>;
  constructor(private docService: DocumentService
              ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.docJson) {
      this.docList = this.docService.SkTreeListFronJSON(this.docJson);
      this.doSearch();
      //
      // const temp  = this.docService.SKTasksList(this.docJson);
      // console.log(temp);
    }
  }

  doSearch(){
    if (this.isSearch && this.searchPhrase !== '') {
      this.docList.forEach( item => item.data = item.data.replace(new RegExp(this.searchPhrase, 'g'), `<span style="background-color: lightcoral;">${this.searchPhrase}</span>`));
    }
  }

}
