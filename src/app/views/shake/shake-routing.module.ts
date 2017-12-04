import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShakeHomePageComponent} from './shake-home-page/shake-home-page.component';

const routes: Routes = [
    {path: 'shake', component: ShakeHomePageComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ShakeRoutingModule {
}
