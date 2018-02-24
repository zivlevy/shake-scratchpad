import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {SharedModule} from '../../shared/shared.module';
import { AdminOrgsManagementComponent } from './admin-orgs-management/admin-orgs-management.component';
import {CoreModule} from '../../core/core.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AdminUsersManagementComponent } from './admin-users-management/admin-users-management.component';
import {MaterialModule} from '../../material/material.module';
import {DeleteApproveComponent} from '../../shared/dialogs/delete-approve/delete-approve.component';
import {AdminService} from './admin.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    CoreModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  declarations: [AdminComponent,
    AdminOrgsManagementComponent,
    AdminUsersManagementComponent,
  ],
  entryComponents: [
    DeleteApproveComponent
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
