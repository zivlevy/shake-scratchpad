import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../../organization/org.service';
import {Org} from '../../../model/org';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {DeleteApproveComponent} from '../../../shared/dialogs/delete-approve/delete-approve.component';
import {AdminService} from '../admin.service';
import 'rxjs/add/operator/takeUntil';
import {MediaService} from '../../../core/media.service';
import {Router} from '@angular/router';

@Component({
  selector: 'sk-admin-orgs-management',
  templateUrl: './admin-orgs-management.component.html',
  styleUrls: ['./admin-orgs-management.component.scss']
})
export class AdminOrgsManagementComponent implements OnInit, OnDestroy, AfterViewInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  currentUser: any;

  orgsDisplayColumns = ['orgId', 'Logo', 'orgName', 'Actions'];
  orgsDataSource = new MatTableDataSource<Org>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthService,
              private adminService: AdminService,
              private orgService: OrgService,
              private mediaService: MediaService,
              private router: Router,
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

    this.mediaService.getSmallScreen$()
      .takeUntil(this.destroy$)
      .subscribe(isSmallScreen => {
        if (isSmallScreen) {
          this.router.navigate([`too-small`])
            .catch(err => console.log(err));
        }
      });
  }

  ngAfterViewInit() {
    this.orgsDataSource.sort = this.sort;
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
          this.adminService.deleteOrgRefs(orgId)
            .then((res1) => {
              console.log(res1);
              this.adminService.deleteOrg(orgId);
            })
            .catch(err => console.log(err));
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
