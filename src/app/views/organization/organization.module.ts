import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../core/core.module';
import {OrganizationRoutingModule} from './organization-routing.module';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgGuard} from './guards/org.guard';
import {OrgService} from './org.service';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule , FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import { OrgNavComponent } from './org-nav/org-nav.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { OrgAdminUsersComponent } from './org-admin-users/org-admin-users.component';
import { OrgAdminOrgComponent } from './org-admin-org/org-admin-org.component';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {ImageCropperModule} from 'ng2-img-cropper';
import {DocumentModule} from '../document/document.module';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {TreeModule} from 'angular-tree-component';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {OrgMessagesComponent} from './org-messages/org-messages.component';
import {OrgTreeViewComponent} from './org-tree-view/org-tree-view.component';
import { OrgSearchDocsComponent } from './org-search-docs/org-search-docs.component';
import { OrgDocViewComponent } from './org-doc-view/org-doc-view.component';
import { OrgDocEditComponent } from './org-doc-edit/org-doc-edit.component';
import { PublishDialogComponent } from './dialogs/publish-dialog/publish-dialog.component';
import { OrgAdminUsersInviteComponent } from './org-admin-users-invite/org-admin-users-invite.component';
import { OrgAdminUsersExistingComponent } from './org-admin-users-existing/org-admin-users-existing.component';
import { OrgAdminUsersInvitedComponent } from './org-admin-users-invited/org-admin-users-invited.component';
import { OrgDocReadAcksComponent } from './org-doc-read-acks/org-doc-read-acks.component';
import {OrgDocService} from './org-doc.service';
import { OrgDocReadAckEditComponent } from './org-doc-read-ack-edit/org-doc-read-ack-edit.component';
import { OrgUserJoinComponent } from './org-user-join/org-user-join.component';
import { OrgContainerComponent } from './org-container/org-container.component';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrgSearchDocComponent } from './org-search-doc/org-search-doc.component';

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
    OrgNavComponent,
    OrgAdminUsersComponent,
    OrgAdminOrgComponent,
    OrgMessagesComponent,
    OrgTreeViewComponent,
    OrgSearchDocsComponent,
    OrgDocViewComponent,
    OrgDocEditComponent,
    PublishDialogComponent,
    OrgDocEditComponent,
    OrgAdminUsersInviteComponent,
    OrgAdminUsersExistingComponent,
    OrgAdminUsersInvitedComponent,
    OrgDocReadAcksComponent,
    OrgDocReadAckEditComponent,
    OrgUserJoinComponent,
    OrgContainerComponent,
    OrgHomeComponent,
    OrgSearchDocComponent,
  ],
  exports: [
    OrgHomePageComponent,
    OrgContainerComponent,
  ],
  entryComponents: [
    PublishDialogComponent
  ],
  providers: [
    OrgGuard,
    OrgService,
    OrgDocService
  ]
})
export class OrganizationModule {

}
