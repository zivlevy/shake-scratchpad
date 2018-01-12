import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import {SharedModule} from '../../shared/shared.module';
import { AdminOrgsManagementComponent } from './admin-orgs-management/admin-orgs-management.component';
import {CoreModule} from "../../core/core.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    CoreModule
  ],
  declarations: [AdminComponent, AdminOrgsManagementComponent]
})
export class AdminModule { }
