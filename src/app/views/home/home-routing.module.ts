import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddOrgComponent} from './add-org/add-org.component';
import {HomepageComponent} from './homepage/homepage.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {OrgAdminUsersComponent} from '../organization/org-admin-users/org-admin-users.component';
import {OrgAdminOrgComponent} from '../organization/org-admin-org/org-admin-org.component';
import {HomeContentComponent} from './home-content/home-content.component';
import {LoginComponent} from '../../shared/login/login.component';
import {SignupComponent} from '../../shared/signup/signup.component';


// const routes: Routes = [
//   {path: '', component: HomepageComponent},
//   {path: 'home', component: HomepageComponent},
//   {path: 'add-org', component: AddOrgComponent},
//   {path: 'user-profile', component: UserProfileComponent},
// ];

const routes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: HomepageComponent, children: [
        {path: '', component: HomeContentComponent},
        {path: 'login', component: LoginComponent},
        {path: 'register', component: SignupComponent},
        {path: 'user-profile', component: UserProfileComponent},
        {path: 'add-org', component: AddOrgComponent},
        {path: 'org-admin', component: OrgAdminOrgComponent},
        {path: 'org-admin-users', component: OrgAdminUsersComponent},

        ]
    }
    ]
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
