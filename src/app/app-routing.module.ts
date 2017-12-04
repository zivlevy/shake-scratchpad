import { NgModule } from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {LoginComponent} from './shared/login/login.component';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {HomepageComponent} from './homepage/homepage.component';
import {SignupComponent} from './shared/signup/signup.component';

const routes: Routes = [


    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: '', redirectTo: '/org/skHolon', pathMatch: 'full'},
    {path: '**', component: NotFoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
