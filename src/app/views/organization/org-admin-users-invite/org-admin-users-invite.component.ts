import { Component, OnInit } from '@angular/core';

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
export class OrgAdminUsersInviteComponent implements OnInit {

  invites: Array<InviteRecord> = new Array<InviteRecord>();
  lastInvite: number;

  constructor() {
    this.lastInvite = 0;
    this.invites.push(new InviteRecord(this.lastInvite));
    this.lastInvite += 1;
  }


  ngOnInit() {
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
    console.log(this.invites);
  }
}
