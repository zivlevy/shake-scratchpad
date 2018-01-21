import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SkDoc, SkDocData} from "../../../model/document";
import {OrgService} from "../org.service";
import {ActivatedRoute} from "@angular/router";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'sk-org-doc-edit',
  templateUrl: './org-doc-edit.component.html',
  styleUrls: ['./org-doc-edit.component.scss']
})
export class OrgDocEditComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('editor') editor;
  orgDocs$;
  currentDoc: SkDoc;
  currentEditData: SkDocData;

  isSaving: boolean;

  constructor(public orgService: OrgService,
              private route: ActivatedRoute) {
    // get doc id from route params
    this.route.params
      .switchMap(params => {
        return this.orgService.getDoc$(params.docId);
      })
      .takeUntil(this.destroy$)
      .subscribe(doc => {
        this.currentDoc = doc;
        this.currentEditData = doc.editVersion;
      });
  }

  ngOnInit() {

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
        .catch(err => {
          console.log(err);
          this.isSaving = false;
        });
    }
  }

  publishDocument() {
    const docData = this.editor.getDoc();
    if (this.currentDoc && this.currentDoc.uid) {
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

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
