import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from "../../../core/image.service";

@Component({
  selector: 'sk-admin-orgs-mamagement-item',
  templateUrl: './admin-orgs-mamagement-item.component.html',
  styleUrls: ['./admin-orgs-mamagement-item.component.scss']
})
export class AdminOrgsMamagementItemComponent implements OnInit {
  @Input() org;
  logoURL: string
  constructor(public imgService: ImageService) { }

  ngOnInit() {
    this.imgService.getOrgLogo$(this.org.orgId).take(1).subscribe( url => (this.logoURL = url));
  }

}
