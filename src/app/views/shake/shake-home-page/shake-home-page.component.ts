import { Component, OnInit } from '@angular/core';
import {ShakeService} from "../shake.service";
import {Observable} from "rxjs/Observable";
import {Organization} from "../../../model/organization";

@Component({
  selector: 'sk-shake-home-page',
  templateUrl: './shake-home-page.component.html',
  styleUrls: ['./shake-home-page.component.scss']
})
export class ShakeHomePageComponent implements OnInit {
  orgList$: Observable<Organization[]>;
  constructor( private shakeService: ShakeService) { }

  ngOnInit() {
    this.orgList$ = this.shakeService.getOrganizations$();
  }

}
