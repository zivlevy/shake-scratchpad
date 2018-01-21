import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgAdminUsersComponent} from './org-admin-users/org-admin-users.component';
import {OrgAdminOrgComponent} from './org-admin-org/org-admin-org.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {LoginComponent} from '../../shared/login/login.component';
import {SignupComponent} from '../../shared/signup/signup.component';
import {OrgHomeContentComponent} from './org-home-content/org-home-content.component';
import {OrgDocManagerComponent} from './org-doc-manager/org-doc-manager.component';
import {OrgSearchDocsComponent} from './org-search-docs/org-search-docs.component';

const routes: Routes = [
  {
    path: 'org',
    children: [
      {
        path: ':id', children: [
          {
             path: '', component: OrgHomePageComponent, children: [
              // {path: '', component: OrgHomeContentComponent},
              {path: '', component: OrgSearchDocsComponent},
              {path: 'login', component: LoginComponent},
              {path: 'register', component: SignupComponent},
              {path: 'user-profile', component: UserProfileComponent},
              {path: 'org-admin-users', component: OrgAdminUsersComponent},
              {path: 'org-admin', component: OrgAdminOrgComponent},
              {path: 'doc-manage', component: OrgDocManagerComponent},
            ]},


        ]
      },
      {path: '', redirectTo: '/home', pathMatch: 'full'}

    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
