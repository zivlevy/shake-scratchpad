import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {HomepageComponent} from './homepage/homepage.component';
import {AddOrgComponent} from "./add-org/add-org.component";
import {LoginComponent} from "./shared/login/login.component";
import {SignupComponent} from "./shared/signup/signup.component";

const routes: Routes = [


  {path: 'login', component: LoginComponent},
  {path: 'register', component: SignupComponent},
  {path: 'home', component: HomepageComponent},
  {path: 'add-org', component: AddOrgComponent},
  {path: '', component: HomepageComponent},
  {path: '', redirectTo: '/org/skHolon', pathMatch: 'full'},
  {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
