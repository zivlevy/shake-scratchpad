import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';
import {OrgUser} from '../../../model/org-user';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {ToasterService} from '../../../core/toaster.service';

@Component({
  selector: 'sk-org-admin-users-existing',
  templateUrl: './org-admin-users-existing.component.html',
  styleUrls: ['./org-admin-users-existing.component.scss']
})
export class OrgAdminUsersExistingComponent implements OnInit, OnDestroy {

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  currentUser: OrgUser;
  orgId: string;

  orgUsersDisplayedColumns = ['isPending', 'photo', 'displayName', 'isViewer', 'isEditor', 'isAdmin', 'Actions'];
  orgUsersDataSource = new MatTableDataSource<OrgUser>();

  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(public auth: AuthService,
              public orgService: OrgService,
              public router: Router,
              private dialog: MatDialog,
              private toaster: ToasterService) {
  }

  ngOnInit() {
    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(orgUser => {
        this.currentUser = orgUser;
      });

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(orgId => {
        this.orgId = orgId;
        this.auth.getOrgUsers$(orgId)
          .takeUntil(this.destroy$)
          .subscribe(users => {
            this.orgUsersDataSource.data = users;
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
        console.log(err);
        this.toaster.toastError('User updated failed');
      });
  }

  userDeleted(userId) {
    this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        msg: 'Delete ?'
      }
    });

    this.confirmDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.orgService.deleteOrgUser(userId)
            .then(() => {
              this.toaster.toastSuccess('User successfully removed from org');
            })
            .catch(err => {
              console.log(err);
              this.toaster.toastError('User removal failed');
            });
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
