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
import { OrgHomeContentComponent } from './org-home-content/org-home-content.component';
import { OrgDocManagerComponent } from './org-doc-manager/org-doc-manager.component';
import {DocumentModule} from '../document/document.module';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import { OrgTreeEditComponent } from './org-tree-edit/org-tree-edit.component';
import {TreeModule} from 'angular-tree-component';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { OrgSearchPanelComponent } from './org-search-panel/org-search-panel.component';
import { OrgSearchResultsComponent } from './org-search-results/org-search-results.component';
import {OrgMessagesComponent} from './org-messages/org-messages.component';
import { OrgTreeEditFreeDocsComponent } from './org-tree-edit-free-docs/org-tree-edit-free-docs.component';
import { OrgTreeEditManagerComponent } from './org-tree-edit-manager/org-tree-edit-manager.component';
import {OrgTreeViewComponent} from './org-tree-view/org-tree-view.component';
import { OrgSearchDocsComponent } from './org-search-docs/org-search-docs.component';
import { OrgDocViewComponent } from './org-doc-view/org-doc-view.component';

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
    FroalaEditorModule,
    FroalaViewModule,
    FormsModule,
    TreeModule,
    FlexLayoutModule,
    MaterialModule

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
    OrgTreeEditComponent,
    OrgSearchPanelComponent,
    OrgSearchResultsComponent,
    OrgMessagesComponent,
    OrgTreeEditFreeDocsComponent,
    OrgTreeEditManagerComponent,
    OrgTreeViewComponent,
    OrgSearchDocsComponent,
    OrgDocViewComponent
  ],
  exports: [OrgHomePageComponent],
  providers: [
    OrgGuard,
    OrgService
  ]
})
export class OrganizationModule {

}
