import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddOrgComponent} from './add-org/add-org.component';
import {HomepageComponent} from './homepage/homepage.component';

const routes: Routes = [
  {path: '', component: HomepageComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'add-org', component: AddOrgComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
