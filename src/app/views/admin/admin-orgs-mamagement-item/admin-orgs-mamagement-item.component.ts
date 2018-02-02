import {Component, Input, OnInit} from '@angular/core';
import {ImageService} from '../../../core/image.service';
import {OrgService} from '../../organization/org.service';
import {DeleteApproveComponent} from '../../../shared/delete-approve/delete-approve.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'sk-admin-orgs-mamagement-item',
  templateUrl: './admin-orgs-mamagement-item.component.html',
  styleUrls: ['./admin-orgs-mamagement-item.component.scss']
})
export class AdminOrgsMamagementItemComponent implements OnInit {
  @Input() org;
  logoUrl = '';
  constructor(public orgService: OrgService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.logoUrl = this.org.logoURL;
  }

  deleteClicked(org) {
    const dialogRef = this.dialog.open(DeleteApproveComponent, {
      data: {
        'orgId': org.orgId,
        'verifyPhrase': org.orgId
      },
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed()
      .subscribe(res => {
        if (res) {
          this.orgService.deleteOrg(org.orgId);
        }
      });
  }

}
