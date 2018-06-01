import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SkItem, SkSection} from '../../../model/document';
import {DocumentService} from '../document.service';

@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit, OnChanges {
  @Input() isRTL: boolean;
  @Input() isNumbering: boolean = true;
  @Input() isDocMap: boolean = false;
  @Input() docJson: string;
  @Input() ident: number = 10;
  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = false;
  docList: Array<SkSection | SkItem>;
  constructor(private docService: DocumentService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.docJson) {
      this.docList = this.docService.SkTreeListFromJSON(this.docJson);
      // this.docMap = this.docService.SkTreeMapFromJSON(this.docJson);
      this.doSearch();
      //
      // const temp  = this.docService.SKTasksList(this.docJson);
      // console.log(temp);
    }
  }

  doSearch() {
    if (this.isSearch && this.searchPhrase !== '') {
      this.docList.forEach((item: any) => {
        const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
        item.data = item.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
      });
    }
  }

}
