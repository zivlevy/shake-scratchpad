import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {SharedModule} from '../../shared/shared.module';
import { AdminOrgsManagementComponent } from './admin-orgs-management/admin-orgs-management.component';
import {CoreModule} from '../../core/core.module';
import { AdminOrgsMamagementItemComponent } from './admin-orgs-mamagement-item/admin-orgs-mamagement-item.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AdminUsersManagementComponent } from './admin-users-management/admin-users-management.component';
import {MaterialModule} from "../../material/material.module";
import { AdminUsersManagementItemComponent } from './admin-users-management-item/admin-users-management-item.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    CoreModule,
    FlexLayoutModule,
    MaterialModule
  ],
  declarations: [AdminComponent,
    AdminOrgsManagementComponent,
    AdminOrgsMamagementItemComponent,
    AdminUsersManagementComponent,
    AdminUsersManagementItemComponent]
})
export class AdminModule { }
