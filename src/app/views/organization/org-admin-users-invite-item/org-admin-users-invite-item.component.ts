import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {InviteRecord} from '../org-admin-users-invite/org-admin-users-invite.component';

@Component({
  selector: 'sk-org-admin-users-invite-item',
  templateUrl: './org-admin-users-invite-item.component.html',
  styleUrls: ['./org-admin-users-invite-item.component.scss']
})
export class OrgAdminUsersInviteItemComponent implements OnInit {

  @Input()
  invite: InviteRecord;

  @Output()
  rowToDelete =  new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  delete(invite) {
    this.rowToDelete.emit(invite.recNumber);
  }
}
