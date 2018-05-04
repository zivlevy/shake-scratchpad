import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../../organization/org.service';
import {Subject} from 'rxjs';
import {ToasterService} from '../../../core/toaster.service';

import {MediaService} from '../../../core/media.service';
import {Router} from '@angular/router';
export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface SkAdmin {
  id: string;
  isSkAdmin: boolean;
  isSkEditor: boolean;
}


@Component({
  selector: 'sk-admin-users-management',
  templateUrl: './admin-users-management.component.html',
  styleUrls: ['./admin-users-management.component.scss']
})
export class AdminUsersManagementComponent implements OnInit, OnDestroy, AfterViewInit {

  adminsDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor'];
  adminsDataSource = new MatTableDataSource<SkAdmin>();

  usersDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor'];
  usersDataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort) sort: MatSort;

  currentUser;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private orgService: OrgService,
              private mediaService: MediaService,
              private router: Router,
              private dialog: MatDialog,
              private toaster: ToasterService) { }

  ngOnInit() {
    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.currentUser = res;
      });

    this.authService.getUsers$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.usersDataSource.data = res;
      });

    this.authService.getSkAdmins$()
      .takeUntil(this.destroy$)
      .subscribe( res => {
        this.adminsDataSource.data = res;
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
    this.usersDataSource.sort = this.sort;
    this.adminsDataSource.sort = this.sort;
  }

  applyUsersFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.usersDataSource.filter = filterValue;
  }

  applyAdminsFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.adminsDataSource.filter = filterValue;
  }

  usersAdminClicked(uid, event) {
    if (event.checked) {
      this.authService.set2Admin(uid, true, false)
        .then(() => {
          this.toaster.toastSuccess('User was given SHAKE administrator privileges');
        });
    }
  }

  usersEditorsClicked(uid, event) {
    if (event.checked) {
      this.authService.set2Admin(uid, false, true)
        .then(() => {
          this.toaster.toastSuccess('User was given SHAKE administrator privileges');
        })
        .catch(err => console.log(err));
    }
  }

  adminsAdminClicked(uid, event) {

    this.authService.isSkEditor$(uid)
      .take(1)
      .subscribe((isSkEditor: boolean) => {
        if (isSkEditor) {
          if (event.checked) {
            this.authService.set2Admin(uid, true, true)
              .catch(err => console.log(err));
          } else {
            this.authService.set2Admin(uid, false, true)
              .catch(err => console.log(err));
          }
        } else {
          if (event.checked) {
            this.authService.set2Admin(uid, true, false)
              .catch(err => console.log(err));
          } else {
            this.authService.setAdmin2User(uid)
              .then(() => {
                this.toaster.toastSuccess('User removed from SHAKE administrator list');
              })
              .catch(err => console.log(err));
          }
        }
      });
  }

  adminsEditorClicked(uid, event) {
    this.authService.isSkAdmin$(uid)
      .take(1)
      .subscribe((isSkAdmin: boolean) => {
        if (isSkAdmin) {
          if (event.checked) {
            this.authService.set2Admin(uid, true, true)
              .catch(err => console.log(err));
          } else {
            this.authService.set2Admin(uid, true, false)
              .catch(err => console.log(err));
          }
        } else {
          if (event.checked) {
            this.authService.set2Admin(uid, false, true)
              .catch(err => console.log(err));
          } else {
            this.authService.setAdmin2User(uid)
              .then(() => {
                this.toaster.toastSuccess('User removed from SHAKE administrator list');
              })
              .catch(err => console.log(err));
          }
        }
      });
  }

  // *************
  // Not implemented because can't delete user from FireBase Authentication list
  // *************

  // userDeleted(user) {
  //   const dialogRef = this.dialog.open(DeleteApproveComponent, {
  //     data: {
  //       'orgId': user.email,
  //       'verifyPhrase': user.email
  //     },
  //     height: '400px',
  //     width: '600px',
  //   });
  //
  //   dialogRef.afterClosed()
  //     .subscribe(res => {
  //       if (res) {
  //
  //         // Delete the user
  //         this.authService.getUserOrgs$(user.id)
  //           .takeUntil(this.destroy$)
  //           .subscribe(orgs => {
  //
  //           });
  //       }
  //     });
  // }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
