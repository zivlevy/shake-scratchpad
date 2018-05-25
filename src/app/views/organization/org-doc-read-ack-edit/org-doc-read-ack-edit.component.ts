import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OrgService} from '../org.service';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {OrgDocService} from '../org-doc.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSort, MatTableDataSource} from '@angular/material';
import {FirestoreService} from '../../../core/firestore.service';
import {DatePipe} from '@angular/common';
import {takeUntil} from 'rxjs/operators';

export interface UserDocAck {
  photo: string;
  displayName: string;
}
@Component({
  selector: 'sk-org-doc-read-ack-edit',
  templateUrl: './org-doc-read-ack-edit.component.html',
  styleUrls: ['./org-doc-read-ack-edit.component.scss']
})
export class OrgDocReadAckEditComponent implements OnInit, OnDestroy, AfterViewInit {

  destroy$: Subject<boolean> = new Subject<boolean>();

  orgId: string;
  docAckEditable: boolean;
  docAckId: string;
  docId: string;
  currentDocAck;
  docAckForm: FormGroup;
  docs: Array<any>;

  docAckName: string;
  docName: string;
  dateCreated: string;


  orgUsersDocAckDisplayedColumns = [ 'isRequired', 'photo', 'displayName', 'hasSigned', 'signedAt'];
  orgUsersDocAckSource = new MatTableDataSource<UserDocAck>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private orgService: OrgService,
              private firestoreService: FirestoreService,
              private orgDocService: OrgDocService) { }

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgId => {
        this.orgId = orgId;

        this.route.params
          .pipe(takeUntil(this.destroy$))
          .subscribe(params => {
            this.docAckId = params.docAckId;

            this.orgDocService.getOrgDocAck$(this.orgId, this.docAckId)
              .pipe(takeUntil(this.destroy$))
              .subscribe(docAck => {
                if (docAck) {
                  this.currentDocAck = docAck;
                  this.docAckName = this.currentDocAck.name;

                  this.docAckEditable = docAck.actualSignatures === 0;

                  this.loadData();
                }
              });

            this.orgService.getDocAckUsers$(this.orgId, this.docAckId)
              .pipe(takeUntil(this.destroy$))
              .subscribe(res => {
                this.orgUsersDocAckSource.data = res;
              });
          });

      });

  }

  ngAfterViewInit() {
    this.orgUsersDocAckSource.sort = this.sort;
  }

  loadData() {
    const datePipe = new DatePipe('en-US');

    this.docAckForm.controls['name'].setValue(this.currentDocAck.name);
    this.docAckForm.controls['requiredSignatures'].setValue(this.currentDocAck.requiredSignatures);
    this.docAckForm.controls['actualSignatures'].setValue(this.currentDocAck.actualSignatures);
    this.docAckForm.controls['docName'].setValue(this.currentDocAck.docName);

    this.dateCreated = datePipe.transform(this.currentDocAck.dateCreated.toDate(), 'MMM dd,yyyy');
    this.docAckForm.controls['dateCreated'].setValue(this.dateCreated);

  }

  isRequiredClicked(uid: string, userName: string, event) {

    if (event.checked) {
      this.orgDocService.addOrgUserReqDocAck(this.orgId, this.docAckId, this.currentDocAck.name, this.currentDocAck.docId, uid, userName)
        .catch(err => console.log(err));
    } else {
      this.orgDocService.removeOrgUserReqDocAck(this.orgId, this.docAckId, uid)
        .catch(err => console.log(err));
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

  selectAllClicked() {
    this.orgService.addReqDocAckToAll(this.orgId, this.docAckId, this.currentDocAck.name, this.currentDocAck.docId)
      .catch(err => console.log(err));
  }

  deSelectAllClicked() {
    this.orgService.removeReqDocAckFromAll(this.orgId, this.docAckId)
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
