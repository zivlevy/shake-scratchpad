import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminComponent} from './admin/admin.component';
import {UserProfileComponent} from "../../shared/user-profile/user-profile.component";

const routes: Routes = [
  {
    path: 'admin',
    children: [
      {path: '', component: AdminComponent, children: [
          {path: 'user-profile', component: UserProfileComponent},


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
