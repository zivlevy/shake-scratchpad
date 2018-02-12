import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgAdminUsersComponent} from './org-admin-users/org-admin-users.component';
import {OrgAdminOrgComponent} from './org-admin-org/org-admin-org.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {LoginComponent} from '../../shared/login/login.component';
import {SignupComponent} from '../../shared/signup/signup.component';
import {OrgSearchDocsComponent} from './org-search-docs/org-search-docs.component';
import {OrgDocEditComponent} from './org-doc-edit/org-doc-edit.component';
import {OrgDocViewComponent} from './org-doc-view/org-doc-view.component';
import {OrgInvitePageComponent} from './org-invite-page/org-invite-page.component';
import {OrgDocReadAcksComponent} from './org-doc-read-acks/org-doc-read-acks.component';
import {OrgDocReadAckEditComponent} from './org-doc-read-ack-edit/org-doc-read-ack-edit.component';
import {OrgGuard} from './guards/org.guard';
import {OrgUserJoinComponent} from './org-user-join/org-user-join.component';

const routes: Routes = [
  {
    path: 'org',
    children: [
      {
        path: ':id', children: [
          {
             path: '', component: OrgHomePageComponent, children: [
              {path: '', component: OrgSearchDocsComponent, canActivate: [OrgGuard]},
              {path: 'invite', component: OrgInvitePageComponent},
              {path: 'login', component: LoginComponent},
              {path: 'register', component: SignupComponent},
              {path: 'user-profile', component: UserProfileComponent, canActivate: [OrgGuard]},
              {path: 'org-admin-users', component: OrgAdminUsersComponent, canActivate: [OrgGuard]},
              {path: 'org-admin', component: OrgAdminOrgComponent, canActivate: [OrgGuard]},
              {path: 'org-doc-edit/:docId/:docType/:docVersion', component: OrgDocEditComponent, canActivate: [OrgGuard]},
              {path: 'org-doc-view/:docId/:docType/:docVersion', component: OrgDocViewComponent, canActivate: [OrgGuard]},
              {path: 'org-doc-read-acks', component: OrgDocReadAcksComponent, canActivate: [OrgGuard]},
              {path: 'org-doc-read-ack/:docAckId', component: OrgDocReadAckEditComponent, canActivate: [OrgGuard]},

            ]},
        ]
      },
      {path: '', redirectTo: '/home', pathMatch: 'full'},
      {path: 'joinOrg/:orgId', component: OrgUserJoinComponent},
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
