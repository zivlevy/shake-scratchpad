import {Component, OnInit, ViewChild} from '@angular/core';
import {SkDoc, SkDocData} from '../../../model/document';
import {OrgService} from '../org.service';

@Component({
  selector: 'sk-org-doc-manager',
  templateUrl: './org-doc-manager.component.html',
  styleUrls: ['./org-doc-manager.component.scss']
})
export class OrgDocManagerComponent implements OnInit {

  @ViewChild('editor') editor;
  orgDocs$;
  currentDoc: SkDoc;
  currentEditData: SkDocData;

  isSaving: boolean;
  constructor( public orgService: OrgService) { }

  ngOnInit() {
    this.orgDocs$ = this.orgService.getAllDocs$();

  }

  docSelected(doc: SkDoc) {
    this.currentDoc = doc;
    this.currentEditData = doc.editVersion;
  }

  newDocument() {
    this.currentDoc = null;
    this.editor.newDoc();
  }
  saveDocument() {
    const docData = this.editor.getDoc();
    if (this.currentDoc && this.currentDoc.uid) {
      this.orgService.saveDoc(this.currentDoc.uid, docData);
    } else {
      this.isSaving = true;
      this.orgService.addDoc(docData).then((res) =>
        this.orgService.getDoc$(res.id).take(1)
        .subscribe(doc => {
          this.currentDoc = doc;
          this.currentEditData = doc.editVersion;
          this.isSaving = false;
        }))
        .catch (err => {
          console.log(err);
          this.isSaving = false;
        });
    }
  }

  publishDocument() {
    const docData = this.editor.getDoc();
    if (this.currentDoc && this.currentDoc.uid ) {
      this.orgService.publishDoc(this.currentDoc.uid, docData);
    } else {
      this.orgService.addDoc(docData)
        .then((doc) => {
          this.orgService.publishDoc(doc.id, docData);
        });
    }
  }

  deleteDocument() {
    if (this.currentDoc && this.currentDoc.uid) {
      this.orgService.deleteDoc(this.currentDoc.uid);
      this.currentEditData = null;
      this.currentDoc = null;
      this.editor.reset();
    }
  }

}
