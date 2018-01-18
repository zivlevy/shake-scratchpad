import {Component, Input, OnInit} from "@angular/core";
import {SkDoc} from "../../../model/document";

@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {

  @Input()
  doc: SkDoc;

  constructor() { }

  ngOnInit() {
  }

}
