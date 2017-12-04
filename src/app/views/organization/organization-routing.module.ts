import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OrgHomePageComponent} from './org-home-page/org-home-page.component';
import {OrgLoginComponent} from './org-login/org-login.component';

const routes: Routes = [
    {
        path: 'org',
        children: [
            {path: ':id', children: [
                {path: '', component: OrgHomePageComponent},
                {path: 'orgLogin', component: OrgLoginComponent}
            ]}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrganizationRoutingModule {
}
