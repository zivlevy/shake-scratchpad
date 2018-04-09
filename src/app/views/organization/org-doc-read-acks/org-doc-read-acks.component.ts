import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {OrgDocService} from '../org-doc.service';
import {OrgService} from '../org.service';
import {Router} from '@angular/router';

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

  readAcksDisplayColumns = ['name', 'docName', 'date Created', 'required Signatures', 'actual Signatures', 'isActive', 'Actions'];
  readAcksDataSource = new MatTableDataSource<OrgAcks>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  orgId: string;

  constructor(private orgService: OrgService,
              private router: Router,
              private orgDocService: OrgDocService) { }

  ngOnInit() {
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.orgId = res;

        this.readAcksDataSource.filter = 'true';
        this.orgDocService.getOrgDocsAcks$(this.orgId)
          .takeUntil(this.destroy$)
          .subscribe(readAcks => {
            this.readAcksDataSource.data = readAcks;
            this.readAcksDataSource.filterPredicate =
              (data: any, filter: string) => filter === 'true' ? data.isActive : true;
          });
      });
  }

  readAckDelete(readAck) {
    this.orgDocService.deleteOrgDocAckP(this.orgId, readAck.id)
      .catch(err => console.log(err));
  }

  addReadAck() {
    this.router.navigate([`org/${this.orgId}/org-doc-read-ack-new`])
      .catch(err => console.log(err));
  }

  editReadAck(readAck) {
    this.router.navigate([`org/${this.orgId}/org-doc-read-ack`, readAck.id])
      .catch(err => console.log(err));
  }

  isActiveChanged(event, readAck) {
    this.orgDocService.updateReadAck(this.orgId, readAck.id, {
      isActive: event.checked
    })
      .catch(err => console.log(err));
  }

  // applyFilterFilter(filterValue: string) {
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  //   this.readAcksDataSource.filter = filterValue;
  // }

  activeOnlyChanged(event) {
    this.readAcksDataSource.filter = event.checked.toString();

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
