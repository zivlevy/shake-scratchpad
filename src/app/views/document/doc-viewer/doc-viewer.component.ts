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
  @Input() ident: number = 0;

  docList: Array<SkSection | SkItem>;
  constructor(private docService: DocumentService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.docJson);
    if (this.docJson) {
      this.docList = this.docService.SkTreeListFronJSON(this.docJson);
    }
  }

  changeIdent() {
    console.log(this.ident)
    this.ident += 5;
    if (this.ident === 30) {
      this.ident = 0;
    }
  }

  toggleNumbering() {
    this.isNumbering = !this.isNumbering;
  }


}
