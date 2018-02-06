import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {OrgDocService} from '../org-doc.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';

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
  docAckId: string;
  docId: string;
  currentDocAck;
  docAckForm: FormGroup;

  docAckName: string;
  docAckRequiredSignatures: number;
  docAckActualSignatures: number;

  orgUsersDocAckDisplayedColumns = [ 'isRequired', 'photo', 'displayName', 'hasSigned', 'Debug'];
  orgUsersDocAckSource = new MatTableDataSource<UserDocAck>();

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private orgService: OrgService,
              private orgDocService: OrgDocService,
              public router: Router) { }

  ngOnInit() {

    this.docAckForm = this.fb.group({
      'name': ['', [
        Validators.required
      ]],
      'requiredSignatures': [{
        disabled: true
      }, ''],
      'actualSignatures': [{
        disabled: true
      }, ''],
    });

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.orgId = org;
      });

    this.route.params
      .takeUntil(this.destroy$)
      .switchMap(params => {
        this.docAckId = params.docAckId;

        this.orgDocService.getOrgUsersDocAck$(this.orgId, this.docAckId)
          .takeUntil(this.destroy$)
          .subscribe(res => {
            this.orgUsersDocAckSource.data = res;
          });
        return this.orgDocService.getOrgDocAck$(this.orgId, this.docAckId);
      })
      .takeUntil(this.destroy$)
      .subscribe(docAck => {
        this.currentDocAck = docAck;

        this.loadData();
      });
  }

  loadData() {
    this.docAckForm.controls['name'].setValue(this.currentDocAck.name);
    this.docAckForm.controls['requiredSignatures'].setValue(this.currentDocAck.requiredSignatures);
    this.docAckForm.controls['actualSignatures'].setValue(this.currentDocAck.actualSignatures);

  }

  isRequiredClicked(uid: string, event) {
    if (event.checked) {
        this.orgDocService.addOrgUserReqDocAck(this.orgId, this.docAckId, uid);
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

  sign(uid) {
    this.orgDocService.userDocAckSign(this.orgId, this.docAckId, uid);
  }
}
