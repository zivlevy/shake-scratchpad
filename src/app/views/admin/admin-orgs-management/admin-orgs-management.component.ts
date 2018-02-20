import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../../organization/org.service';
import {Org} from '../../../model/org';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {DeleteApproveComponent} from '../../../shared/dialogs/delete-approve/delete-approve.component';
import {AdminService} from '../admin.service';

@Component({
  selector: 'sk-admin-orgs-management',
  templateUrl: './admin-orgs-management.component.html',
  styleUrls: ['./admin-orgs-management.component.scss']
})
export class AdminOrgsManagementComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;

  orgsDisplayColumns = ['orgId', 'Logo', 'org Name', 'Actions'];
  orgsDataSource = new MatTableDataSource<Org>();

  constructor(private authService: AuthService,
              private adminService: AdminService,
              private orgService: OrgService,
              private dialog: MatDialog,
              ) {}

  ngOnInit() {
    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(authUser => {
        this.currentUser = authUser;
      });

    this.adminService.getOrgs$()
      .takeUntil(this.destroy$)
      .subscribe( orgs => {
        this.orgsDataSource.data = orgs;
      });
  }

  applyOrgsFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.orgsDataSource.filter = filterValue;
  }

  deleteClicked(orgId) {
    const dialogRef = this.dialog.open(DeleteApproveComponent, {
      data: {
        'msg': 'Delete Organization',
        'orgId': orgId,
        'verifyPhrase': orgId
      },
      // height: '400px',
      // width: '600px',
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (res) {
          this.adminService.deleteOrg(orgId);
        }
      });
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
