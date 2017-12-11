import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgGuard} from './guards/org.guard';
import {OrgService} from './org.service';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';
import { OrgUserDetailsComponent } from './org-user-details/org-user-details.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    OrganizationRoutingModule,
    TranslateModule.forChild(),
    ReactiveFormsModule
  ],
  declarations: [
    OrgHomePageComponent,
    OrgUserDetailsComponent
  ],
  exports: [OrgHomePageComponent],
  providers: [
    OrgGuard,
    OrgService
  ]
})
export class OrganizationModule {

}
