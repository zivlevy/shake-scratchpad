import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgAdminUsersComponent} from './org-admin-users/org-admin-users.component';
import {OrgAdminOrgComponent} from './org-admin-org/org-admin-org.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {LoginComponent} from '../../shared/login/login.component';
import {SignupComponent} from '../../shared/signup/signup.component';

const routes: Routes = [
  {
    path: 'org',
    children: [
      {
        path: ':id', children: [
          {
            path: '', component: OrgHomePageComponent, children: [
              {path: 'login', component: LoginComponent},
              {path: 'register', component: SignupComponent},
              {path: 'user-profile', component: UserProfileComponent},
              {path: 'admin-users', component: OrgAdminUsersComponent},
              {path: 'admin-org', component: OrgAdminOrgComponent}

            ]}
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
