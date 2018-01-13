import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from "../../../core/image.service";
import {OrgService} from "../../organization/org.service";

@Component({
  selector: 'sk-admin-orgs-mamagement-item',
  templateUrl: './admin-orgs-mamagement-item.component.html',
  styleUrls: ['./admin-orgs-mamagement-item.component.scss']
})
export class AdminOrgsMamagementItemComponent implements OnInit {
  @Input() org;
  logoUrl = '';
  constructor(public imgService: ImageService,
              public orgService: OrgService) { }

  ngOnInit() {
    this.imgService.getOrgLogo$(this.org.orgId)
      .take(1)
      .subscribe( url => {
        this.logoUrl = url;
      });
  }

  deleteClicked(org) {
    this.orgService.deleteOrg(org.orgId);
  }
}
