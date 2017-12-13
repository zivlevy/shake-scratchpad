import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgGuard} from './guards/org.guard';
import {OrgService} from './org.service';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import { OrgAdminComponent } from './org-admin/org-admin.component';
import { OrgAdminUserItemComponent } from './org-admin-user-item/org-admin-user-item.component';
import {SharedModule} from '../../shared/shared.module';
import {MyMaterialModule} from '../../material-module/my--material.module';

@NgModule({
  imports: [
    CommonModule,
    MyMaterialModule,
    CoreModule,
    SharedModule,
    OrganizationRoutingModule,
    TranslateModule.forChild(),
    ReactiveFormsModule
  ],
  declarations: [
    OrgHomePageComponent,
    OrgAdminComponent,
    OrgAdminUserItemComponent,
  ],
  exports: [OrgHomePageComponent],
  providers: [
    OrgGuard,
    OrgService
  ]
})
export class OrganizationModule {

}
