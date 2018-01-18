import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {UserProfileComponent} from '../../shared/user-profile/user-profile.component';
import {AdminOrgsManagementComponent} from './admin-orgs-management/admin-orgs-management.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {path: '', component: AdminComponent, children: [
          {path: 'user-profile', component: UserProfileComponent},
          {path: 'orgs', component: AdminOrgsManagementComponent}
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
