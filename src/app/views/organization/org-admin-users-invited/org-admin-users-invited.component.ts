import {Component, OnDestroy, OnInit} from '@angular/core';
import {InviteRecord} from '../org-admin-users-invite/org-admin-users-invite.component';
import {MatTableDataSource} from '@angular/material';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-org-admin-users-invited',
  templateUrl: './org-admin-users-invited.component.html',
  styleUrls: ['./org-admin-users-invited.component.scss']
})
export class OrgAdminUsersInvitedComponent implements OnInit, OnDestroy {
  displayedColumns = ['displayName', 'email', 'isViewer', 'isEditor', 'isAdmin', 'Actions'];
  dataSource = new MatTableDataSource<InviteRecord>();
  orgId: string;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private orgService: OrgService) { }

  ngOnInit() {
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orgId => {
        this.orgId = orgId;
        this.orgService.getOrgUsersInvites$(orgId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((users: any) => {
            this.dataSource.data = users;
          });
      });
  }
  inviteDelete(email) {
    this.orgService.deleteOrgUserInviteP(this.orgId, email)
      .catch(err => console.log(err));
  }

  isViewerClicked(mail: string, event)
  {
    this.orgService.setOrgInviteIsViewer(this.orgId, mail, event.checked)
      .catch(err => console.log(err));
  }

  isEditorClicked(mail: string, event)
  {
    this.orgService.setOrgInviteIsEditor(this.orgId, mail, event.checked)
      .catch(err => console.log(err));
  }

  isAdminClicked(mail: string, event)
  {
    this.orgService.setOrgInviteIsAdmin(this.orgId, mail, event.checked)
      .catch(err => console.log(err));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
