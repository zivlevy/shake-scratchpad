import { Component, OnInit } from '@angular/core';
import {SkDoc, SkDocData} from "../../../model/document";
import {OrgService} from "../org.service";

@Component({
  selector: 'sk-org-doc-manager',
  templateUrl: './org-doc-manager.component.html',
  styleUrls: ['./org-doc-manager.component.scss']
})
export class OrgDocManagerComponent implements OnInit {
  orgDocs$;
  currentDoc: SkDoc;
  currentEditData: SkDocData;
  constructor( public orgService:OrgService) { }

  ngOnInit() {
    this.orgDocs$ = this.orgService.getAllDocs$();

  }

  docSelected(doc: SkDoc) {
    this.currentDoc = doc;
    this.currentEditData = doc.editVersion;
    console.log(doc);
  }

}
