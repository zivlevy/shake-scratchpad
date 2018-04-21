import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgAdminUsersComponent} from './org-admin-users/org-admin-users.component';
import {OrgAdminOrgComponent} from './org-admin-org/org-admin-org.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {LoginComponent} from '../../shared/login/login.component';
import {SignupComponent} from '../../shared/signup/signup.component';
import {OrgDocEditComponent} from './org-doc-edit/org-doc-edit.component';
import {OrgDocViewComponent} from './org-doc-view/org-doc-view.component';
import {OrgDocReadAcksComponent} from './org-doc-read-acks/org-doc-read-acks.component';
import {OrgDocReadAckEditComponent} from './org-doc-read-ack-edit/org-doc-read-ack-edit.component';
import {OrgAdminGuard, OrgEditorGuard, OrgGuard} from './guards/org.guard';
import {OrgUserJoinComponent} from './org-user-join/org-user-join.component';
import {OrgContainerComponent} from './org-container/org-container.component';
import {OrgHomeComponent} from './org-home/org-home.component';
import {OrgDocReadCreateComponent} from './org-doc-read-create/org-doc-read-create.component';
import {ScreenTooSmallComponent} from '../../shared/screen-too-small/screen-too-small.component';
import {NotFoundComponent} from '../../shared/not-found/not-found.component';
import {AuthGuard} from "../../shared/guards/auth.guard";

const routes: Routes = [
  {
    path: 'org',
    children: [
      {
        path: ':id', children: [
          {
             path: '', component: OrgContainerComponent, children: [
              {path: '', component: OrgHomeComponent, canActivate: [OrgGuard]},
              {path: 'org-join', component: OrgUserJoinComponent},
              {path: 'login', component: LoginComponent},
              {path: 'register', component: SignupComponent},
              {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
              {path: 'org-admin-users', component: OrgAdminUsersComponent, canActivate: [OrgAdminGuard]} ,
              {path: 'org-admin', component: OrgAdminOrgComponent, canActivate: [OrgAdminGuard]},
              {path: 'org-doc-edit/:docId/:docType/:docVersion/:isSearch/:searchPhrase', component: OrgDocEditComponent, canActivate: [OrgEditorGuard]},
              {path: 'org-doc-view/:docId/:docType/:docVersion/:isSearch/:searchPhrase', component: OrgDocViewComponent, canActivate: [OrgGuard]},
              {path: 'org-doc-read-acks', component: OrgDocReadAcksComponent, canActivate: [OrgEditorGuard]},
              {path: 'org-doc-read-ack-new', component: OrgDocReadCreateComponent, canActivate: [OrgEditorGuard]},
              {path: 'org-doc-read-ack/:docAckId', component: OrgDocReadAckEditComponent, canActivate: [OrgEditorGuard]},
              {path: 'too-small', component: ScreenTooSmallComponent},
              {path: '**', component: NotFoundComponent}

            ]},
        ]
      },
      {path: '', redirectTo: '/home', pathMatch: 'full'},
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
