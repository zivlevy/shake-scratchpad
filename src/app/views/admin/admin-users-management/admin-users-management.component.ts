import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material";
import {AuthService} from "../../../core/auth.service";

export interface Element {
  displayName: string;
  uid: string;
  email: string;
}

export interface User {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

const ELEMENT_DATA: Element[] = [
  {uid: '1', displayName: 'Ran Levy', email: 'ran@kmrom.com'},


];

@Component({
  selector: 'sk-admin-users-management',
  templateUrl: './admin-users-management.component.html',
  styleUrls: ['./admin-users-management.component.scss']
})
export class AdminUsersManagementComponent implements OnInit {

  displayedColumns = ['photoURL', 'displayName', 'email'];
  dataSource = new MatTableDataSource<User>();

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUsers$()
      .subscribe(res => {
        console.log(res);
        this.dataSource.data = res;
        console.log(this.dataSource);
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


}
