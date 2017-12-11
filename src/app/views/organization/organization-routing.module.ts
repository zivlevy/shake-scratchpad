import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgUserDetailsComponent} from './org-user-details/org-user-details.component';

const routes: Routes = [
    {
        path: 'org',
        children: [
            {path: ':id', children: [
                {path: '', component: OrgHomePageComponent},
                {path: 'userDetails', component: OrgUserDetailsComponent}
            ]},
          {path: '', redirectTo: '/home', pathMatch: 'full'}

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
