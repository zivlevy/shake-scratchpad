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
import {AuthGuard} from '../../shared/guards/auth.guard';
import {NotAuthenticatedComponent} from '../../shared/not-authenticated/not-authenticated.component';
import {ScreenTooSmallComponent} from '../../shared/screen-too-small/screen-too-small.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: HomepageComponent, children: [
          {path: '', component: HomeContentComponent},
          {path: 'notAuthenticated', component: NotAuthenticatedComponent},
          {path: 'login', component: LoginComponent},
          {path: 'register', component: SignupComponent},
          {path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
          {path: 'add-org', component: AddOrgComponent, canActivate: [AuthGuard]},
          {path: 'org-admin', component: OrgAdminOrgComponent, canActivate: [AuthGuard]},
          {path: 'org-admin-users', component: OrgAdminUsersComponent, canActivate: [AuthGuard]},
          {path: 'too-small', component: ScreenTooSmallComponent}
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
