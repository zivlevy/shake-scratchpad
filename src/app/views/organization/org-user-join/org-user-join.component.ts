import { Component, OnInit } from '@angular/core';
import {OrgService} from "../org.service";

@Component({
  selector: 'sk-org-user-join',
  templateUrl: './org-user-join.component.html',
  styleUrls: ['./org-user-join.component.scss']
})
export class OrgUserJoinComponent implements OnInit {

  constructor(private orgService: OrgService) { }

  ngOnInit() {
  }

  join() {
    this.orgService.joinToOrg();
  }
}
