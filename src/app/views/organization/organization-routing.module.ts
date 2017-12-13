import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgAdminComponent} from './org-admin/org-admin.component';

const routes: Routes = [
  {
    path: 'org',
    children: [
      {
        path: ':id', children: [
          {
            path: '', component: OrgHomePageComponent, children: [
              {path: 'admin', component: OrgAdminComponent},

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
