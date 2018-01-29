import {Component, OnDestroy, OnInit} from "@angular/core";
import {OrgService} from "../org.service";
import {Subject} from "rxjs/Subject";

export class InviteRecord {
  recNumber: number;
  displayName: string;
  email: string;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;

  constructor(recNumber: number) {
    this.recNumber = recNumber;
    this.displayName = '';
    this.email = '';
    this.isAdmin = false;
    this.isEditor = false;
    this.isViewer = true;
  }
}


@Component({
  selector: 'sk-org-admin-users-invite',
  templateUrl: './org-admin-users-invite.component.html',
  styleUrls: ['./org-admin-users-invite.component.scss']
})
export class OrgAdminUsersInviteComponent implements OnInit, OnDestroy {

  invites: Array<InviteRecord> = new Array<InviteRecord>();
  lastInvite: number;
  orgId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private orgService: OrgService) {
    this.lastInvite = 0;
    this.invites.push(new InviteRecord(this.lastInvite));
    this.lastInvite += 1;
  }


  ngOnInit() {
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(orgId => {
        this.orgId = orgId;
      });
  }

  addNew() {
    this.invites.push(new InviteRecord(this.lastInvite));
    this.lastInvite += 1;
  }

  deleteRow (recNum) {
    const indx = this.invites.findIndex(i => i.recNumber === recNum);
    this.invites.splice(indx, 1);
  }

  invite() {
    for (const invite of this.invites) {
      this.orgService.setOrgInvites(this.orgId, invite.displayName, invite.email, invite.isAdmin, invite.isEditor, invite.isViewer)
        .then(() => console.log('done'));
    }
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
