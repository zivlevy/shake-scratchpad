import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../core/auth.service';
import {ToastrService} from 'ngx-toastr';
import {OrgService} from '../../organization/org.service';
import {Subject} from 'rxjs/Subject';
import {DeleteApproveComponent} from "../../../shared/dialogs/delete-approve/delete-approve.component";

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
export class AdminUsersManagementComponent implements OnInit, OnDestroy {

  // adminsDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor', 'Actions'];
  adminsDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor'];
  adminsDataSource = new MatTableDataSource<SkAdmin>();

  // usersDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor', 'Actions'];
  usersDisplayedColumns = ['photoURL', 'displayName', 'email', 'isSkAdmin', 'isSkEditor'];
  usersDataSource = new MatTableDataSource<User>();

  currentUser;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private orgService: OrgService,
              private dialog: MatDialog,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.currentUser = res;
        console.log(res);
      });

    this.authService.getUsers$()
      .takeUntil(this.destroy$)
      .subscribe(res => {
        this.usersDataSource.data = res;
      });

    this.authService.getSkAdmins$()
      // .takeUntil(this.destroy$)
      .subscribe( res => {
        console.log(res);
        this.adminsDataSource.data = res;
      });

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
          this.toastr.success('User was given SHAKE administrator privileges', '', {
            timeOut: 2000
          });
        });
    }
  }

  usersEditorsClicked(uid, event) {
    if (event.checked) {
      this.authService.set2Admin(uid, false, true)
        .then(() => {
          this.toastr.success('User was given SHAKE administrator privileges', '', {
            timeOut: 2000
          });
        });
    }
  }

  adminsAdminClicked(uid, event) {

    this.authService.isSkEditor$(uid)
      .take(1)
      .subscribe((isSkEditor: boolean) => {
        if (isSkEditor) {
          if (event.checked) {
            this.authService.set2Admin(uid, true, true);
          } else {
            this.authService.set2Admin(uid, false, true);
          }
        } else {
          if (event.checked) {
            this.authService.set2Admin(uid, true, false);
          } else {
            this.authService.setAdmin2User(uid)
              .then(() => {
                this.toastr.success('User removed from SHAKE administrator list', '', {
                  timeOut: 2000
                });
              });
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
            this.authService.set2Admin(uid, true, true);
          } else {
            this.authService.set2Admin(uid, true, false);
          }
        } else {
          if (event.checked) {
            this.authService.set2Admin(uid, false, true);
          } else {
            this.authService.setAdmin2User(uid)
              .then(() => {
                this.toastr.success('User removed from SHAKE administrator list', '', {
                  timeOut: 2000
                });
              });
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
