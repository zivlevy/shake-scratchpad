import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {OrgDocService} from '../org-doc.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {FirestoreService} from '../../../core/firestore.service';
import {DatePipe} from '@angular/common';

export interface UserDocAck {
  photo: string;
  displayName: string;
}
@Component({
  selector: 'sk-org-doc-read-ack-edit',
  templateUrl: './org-doc-read-ack-edit.component.html',
  styleUrls: ['./org-doc-read-ack-edit.component.scss']
})
export class OrgDocReadAckEditComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  orgId: string;
  newDocAck: boolean;
  docAckEditable: boolean;
  docAckId: string;
  docId: string;
  currentDocAck;
  docAckForm: FormGroup;
  docs: Array<any>;

  docAckName: string;
  docName: string;
  dateCreated: string;
  docAckRequiredSignatures: number;
  docAckActualSignatures: number;

  orgUsersDocAckDisplayedColumns = [ 'isRequired', 'photo', 'displayName', 'hasSigned', 'signedAt'];
  orgUsersDocAckSource = new MatTableDataSource<UserDocAck>();

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private orgService: OrgService,
              private firestoreService: FirestoreService,
              private orgDocService: OrgDocService,
              public router: Router) { }

  ngOnInit() {

    this.docAckForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      'docName': [{
        value: '',
        disabled: true
      }, [
        Validators.required
      ]],
      'dateCreated': [{
        value: '',
        disabled: true
      }, [
        Validators.required
      ]],
      'requiredSignatures': [{
        value: 0,
        disabled: true
      }, ''],
      'actualSignatures': [{
        value: 0,
        disabled: true
      }, ''],
    });

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(orgId => {
        this.orgId = orgId;

        this.route.params
          .takeUntil(this.destroy$)
          .subscribe(params => {
            this.newDocAck = !params.docAckId;

            if (!this.newDocAck) {
              this.docAckId = params.docAckId;

              this.orgDocService.getOrgDocAck$(this.orgId, this.docAckId)
                .takeUntil(this.destroy$)
                .subscribe(docAck => {
                  if (docAck) {
                    this.currentDocAck = docAck;
                    if (docAck.actualSignatures === 0) {
                      this.docAckEditable = true;
                    } else {
                      this.docAckEditable = false;
                    }
                    this.loadData();
                  }
                });

              this.orgDocService.getDocAckUsers$(this.orgId, this.docAckId)
                .takeUntil(this.destroy$)
                .subscribe(res => {
                  this.orgUsersDocAckSource.data = res;
                });
            }
          });

        this.orgDocService.getOrgPublishedDocs$(orgId)
          .takeUntil(this.destroy$)
          .subscribe(docs => {
            this.docs = docs;
          });
      });

  }

  loadData() {
    const datePipe = new DatePipe('en-US');

    this.docAckForm.controls['name'].setValue(this.currentDocAck.name);
    this.docAckForm.controls['requiredSignatures'].setValue(this.currentDocAck.requiredSignatures);
    this.docAckForm.controls['actualSignatures'].setValue(this.currentDocAck.actualSignatures);

    this.dateCreated = datePipe.transform(this.currentDocAck.dateCreated, 'MMM dd,yyyy');
    this.docAckForm.controls['dateCreated'].setValue(this.dateCreated);

    this.orgDocService.getDocNameP(this.orgId, this.currentDocAck.docId)
      .then(docName => {
        this.docAckForm.controls['docName'].setValue(docName);
      });
  }

  docSelected(doc) {
    console.log(doc);
    if (this.newDocAck) {
      this.orgDocService.createNewDocAck(this.orgId, {
        name: doc.name + ' - ' + new Date().getFullYear(),
        docId: doc.uid,
        requiredSignatures: 0,
        actualSignatures: 0,
        isActive: true,
        dateCreated: this.firestoreService.timestamp
      })
      .then(res => {
        this.router.navigate([`org/${this.orgId}/org-doc-read-ack`, res.id]);
      });
    } else {
      if (doc.uid !== this.currentDocAck.docId) {
        this.orgDocService.setDocAckData(this.orgId, this.docAckId, {docId: doc.uid})
          .then(() => {
            this.orgDocService.getDocNameP(this.orgId, this.currentDocAck.docId)
              .then(docName => {
                this.docAckForm.controls['docName'].setValue(docName);
              });
          });
      }
    }


  }

  isActiveChanged(event) {
    console.log(this.orgId, this.docAckId, event.checked);
    this.orgDocService.updateReadAck(this.orgId, this.docAckId, {
      isActive: event.checked
    });
  }

  isRequiredClicked(uid: string, userName: string, event) {
    if (event.checked) {
        this.orgDocService.addOrgUserReqDocAck(this.orgId, this.docAckId, this.currentDocAck.name, this.currentDocAck.docId, uid, userName);
    } else {
      this.orgDocService.removeOrgUserReqDocAck(this.orgId, this.docAckId, uid);
    }
  }
  nameUpdateClicked() {
    const newData = {
      'name': this.docAckName
    };
    this.orgDocService.setDocAckData(this.orgId, this.docAckId, newData)
      .then()
      .catch();
  }

  nameUpdateCanceled() {
    this.docAckName = this.currentDocAck.name;
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
