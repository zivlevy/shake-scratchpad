import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {MatDialog, MatDialogRef, MatTableDataSource} from "@angular/material";
import {Router} from '@angular/router';
import {OrgUser} from '../../../model/org-user';
import {ToastrService} from 'ngx-toastr';
import {ConfirmDialogComponent} from "../../../shared/dialogs/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'sk-org-admin-users-existing',
  templateUrl: './org-admin-users-existing.component.html',
  styleUrls: ['./org-admin-users-existing.component.scss']
})
export class OrgAdminUsersExistingComponent implements OnInit, OnDestroy {

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  currentUser: OrgUser;
  orgId: string;

  orgUsersDisplayedColumns = ['isPending', 'photo', 'displayName', 'isAdmin', 'isEditor', 'isViewer', 'Actions'];
  orgUsersDataSource = new MatTableDataSource<OrgUser>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(public auth: AuthService,
              public orgService: OrgService,
              public router: Router,
              private dialog: MatDialog,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(orgUser => {
        this.currentUser = orgUser;
        console.log('current', this.currentUser);
      });

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(orgId => {
        this.orgId = orgId;
        this.auth.getOrgUsers$(orgId)
          .takeUntil(this.destroy$)
          .subscribe(users => {
            this.orgUsersDataSource.data = users;
            console.log(users);
          });
      });

  }

  isPendingClicked(uid: string, event) {
    let user;
    if (event.checked) {
      user = {
        'uid': uid,
        'isPending': true,
        'roles': {
          admin: false,
          editor: false,
          viewer: false
        }
      };
    } else {
      user = {
        'uid': uid,
        'isPending': false
      };
    }
    this.userChanged(user);
  }

  isAdminClicked(uid: string, event) {
    let user;
    if (event.checked) {
      user = {
        'uid': uid,
        'isPending': false,
        'roles.admin': true
      };
    } else {
      user = {
        'uid': uid,
        'roles.admin': false
      };
    }
    this.userChanged(user);
  }

  isEditorClicked(uid: string, event) {
    let user;
    if (event.checked) {
      user = {
        'uid': uid,
        'isPending': false,
        'roles.editor': true
      };
    } else {
      user = {
        'uid': uid,
        'roles.editor': false
      };
    }
    this.userChanged(user);
  }

  isViewerClicked(uid: string, event) {
    let user;
    if (event.checked) {
      user = {
        'uid': uid,
        'isPending': false,
        'roles.viewer': true
      };
    } else {
      user = {
        'uid': uid,
        'roles.viewer': false
      };
    }
    this.userChanged(user);
  }

  userChanged(user) {
    console.log(user);
    this.orgService.updateOrgUser(user.uid, user)
      .then(() => {
      })
      .catch(err => {
        // this.snackBar.open('User updated failed', '', {duration: 2000,   panelClass: ['snackbar-fail']});
        this.toastr.error(err.message, 'User updated failed', {
          timeOut: 2000
        });
      });
  }

  userDeleted(userId) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Delete?'
      }
    });

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.orgService.deleteOrgUser(userId)
            .then(() => {

              this.toastr.success('User successfully removed from org', '', {
                timeOut: 5000
              });
            })
            .catch(err => {

              this.toastr.error(err.message, 'User removal failed', {
                timeOut: 5000
              });
            });        }
      });


  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
