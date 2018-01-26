import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';

class InviteRecord {
  displayName: string;
  email: string;
  isAdmin: boolean;
  isEditor: boolean;
  isViewer: boolean;

  constructor() {
    this.displayName = '';
    this.email = '';
    this.isAdmin = false;
    this.isEditor = false;
    this.isViewer = true;
  }
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: Element[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},

];

@Component({
  selector: 'sk-org-admin-users-invite',
  templateUrl: './org-admin-users-invite.component.html',
  styleUrls: ['./org-admin-users-invite.component.scss']
})
export class OrgAdminUsersInviteComponent implements OnInit {
  newInvite: InviteRecord = new InviteRecord();
  invites: Array<InviteRecord> = new Array<InviteRecord>();

  // data: Array<Element> = new Array<Element>([{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}]);

  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);

  constructor() { }


  ngOnInit() {
  }

  addNew() {
  }

  invite() {
    console.log('Invite!');
  }
}
