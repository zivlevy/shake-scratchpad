import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {OrgUser} from '../../../model/org-user';

@Component({
  selector: 'sk-org-admin-user-item',
  templateUrl: './org-admin-user-item.component.html',
  styleUrls: ['./org-admin-user-item.component.scss']
})
export class OrgAdminUserItemComponent implements OnInit {
  @Input() user: OrgUser;
  @Output() userChanged: EventEmitter <OrgUser> =  new EventEmitter();
  @Output() userDelete: EventEmitter <string> =  new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  save(pending, admin, editor, viewer) {
    console.log(this.user);
    this.userChanged.emit({... this.user, isPending: pending, roles: {admin, editor, viewer}});

  }

  delete(){
    this.userDelete.emit(this.user.uid);
  }

}
