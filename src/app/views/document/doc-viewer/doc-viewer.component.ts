import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {SkDoc, SkDocData} from '../../../model/document';
import {DocumentService} from "../document.service";

@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit, OnChanges {

  @Input() docJson: string;

  constructor(private docService: DocumentService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.docJson);
    if (this.docJson) {
      this.docService.SkTreeListFronJSON(this.docJson);
    }
  }


}
