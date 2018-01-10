import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {SharedModule} from '../../shared/shared.module';
import { AdminOrgsManagementComponent } from './admin-orgs-management/admin-orgs-management.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [AdminComponent, AdminOrgsManagementComponent]
})
export class AdminModule { }
