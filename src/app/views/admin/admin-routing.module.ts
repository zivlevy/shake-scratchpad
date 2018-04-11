import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {AdminOrgsManagementComponent} from './admin-orgs-management/admin-orgs-management.component';
import {AdminUsersManagementComponent} from './admin-users-management/admin-users-management.component';
import {SkAdminGuard} from './admin.guard';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {path: '', component: AdminComponent, children: [
          {path: 'user-profile', component: UserProfileComponent},
          {path: 'admin-users', component: AdminUsersManagementComponent, canActivate: [SkAdminGuard]},
          {path: 'admin-orgs', component: AdminOrgsManagementComponent, canActivate: [SkAdminGuard]},
        ],
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
