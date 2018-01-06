import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgGuard} from './guards/org.guard';
import {OrgService} from './org.service';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule , FormsModule} from '@angular/forms';
import { OrgAdminComponent } from './org-admin/org-admin.component';
import { OrgAdminUserItemComponent } from './org-admin-user-item/org-admin-user-item.component';
import {SharedModule} from '../../shared/shared.module';
import { OrgNavComponent } from './org-nav/org-nav.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { OrgAdminUsersComponent } from './org-admin-users/org-admin-users.component';
import { OrgAdminOrgComponent } from './org-admin-org/org-admin-org.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {ImageCropperModule} from 'ng2-img-cropper';
import {AlgoliaService} from "../../core/algolia.service";
import { OrgHomeContentComponent } from './org-home-content/org-home-content.component';
import { OrgDocManagerComponent } from './org-doc-manager/org-doc-manager.component';
import {DocumentModule} from "../document/document.module";

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    DocumentModule,
    OrganizationRoutingModule,
    TranslateModule,
    BsDropdownModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    ImageCropperModule,

  ],
  declarations: [
    OrgHomePageComponent,
    OrgAdminComponent,
    OrgAdminUserItemComponent,
    OrgNavComponent,
    OrgAdminUsersComponent,
    OrgAdminOrgComponent,
    OrgHomeContentComponent,
    OrgDocManagerComponent,
  ],
  exports: [OrgHomePageComponent],
  providers: [
    OrgGuard,
    OrgService,
    AlgoliaService
  ]
})
export class OrganizationModule {

}
