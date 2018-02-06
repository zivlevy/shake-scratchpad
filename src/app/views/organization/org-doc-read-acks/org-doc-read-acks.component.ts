import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {OrgDocService} from '../org-doc.service';
import {OrgService} from '../org.service';
import {Org} from '../../../model/org';
import {Router} from "@angular/router";

export interface OrgAcks {
  name: string;
  dateCreated: object;
  isActive: boolean;
  requiredSignatures: number;
  actualSignatures: number;
}
@Component({
  selector: 'sk-org-doc-read-acks',
  templateUrl: './org-doc-read-acks.component.html',
  styleUrls: ['./org-doc-read-acks.component.scss']
})
export class OrgDocReadAcksComponent implements OnInit, OnDestroy {

  readAcksDisplayColumns = ['name', 'docName', 'date Created', 'required Signatures', 'actual Signatures', 'isActive', 'Actions', 'Debug'];
  readAcksDataSource = new MatTableDataSource<OrgAcks>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  orgId: string;

  constructor(private orgService: OrgService,
              public router: Router,
              private orgDocService: OrgDocService) { }

  ngOnInit() {
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.orgId = res;

        this.orgDocService.getOrgDocsAcks$(this.orgId)
          .takeUntil(this.destroy$)
          .subscribe(readAcks => {
            console.log(readAcks);
            this.readAcksDataSource.data = readAcks;
          });
      });
  }

  readAckDelete(readAck) {

  }

  reqInc(readAck) {
    this.orgDocService.updateDocsAcksFieldP(this.orgId, readAck.id, 'requiredSignatures', 'inc');
  }

  reqDec(readAck) {
    this.orgDocService.updateDocsAcksFieldP(this.orgId, readAck.id, 'requiredSignatures', 'dec');
  }

  actualInc(readAck) {
    this.orgDocService.updateDocsAcksFieldP(this.orgId, readAck.id, 'actualSignatures', 'inc');

  }

  actualDec(readAck) {
    this.orgDocService.updateDocsAcksFieldP(this.orgId, readAck.id, 'actualSignatures', 'dec');

  }

  addReadAck() {
    this.router.navigate([`org/${this.orgId}/org-doc-read-ack`, '']);
  }

  editReadAck(readAck) {
    this.router.navigate([`org/${this.orgId}/org-doc-read-ack`, readAck.id]);

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
