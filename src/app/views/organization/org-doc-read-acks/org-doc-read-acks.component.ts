import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {OrgDocService} from '../org-doc.service';
import {OrgService} from '../org.service';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {ToasterService} from '../../../core/toaster.service';

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
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  readAcksDisplayColumns = ['name', 'docName', 'date Created', 'required Signatures', 'actual Signatures', 'isActive', 'Actions'];
  readAcksDataSource = new MatTableDataSource<OrgAcks>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  orgId: string;

  constructor(private orgService: OrgService,
              private router: Router,
              private dialog: MatDialog,
              private toaster: ToasterService,
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
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Delete Read & Sign ?'
      }
    });

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          // this.orgDocService.deleteOrgDocAckP(this.orgId, readAck.id)

          this.orgDocService.deleteDocAck(this.orgId, readAck.id, readAck.docId)
            .catch(err => console.log(err));        }
      });


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
    if (event.checked) {
      this.orgService.activateReadAck(this.orgId, readAck.id, readAck.docId)
        .catch(err => console.log(err));
    } else {
      this.orgService.deActivateReadAck(this.orgId, readAck.id, readAck.docId)
        .catch(err => console.log(err));
    }
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
