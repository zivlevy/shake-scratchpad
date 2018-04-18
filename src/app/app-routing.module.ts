import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {ScreenTooSmallComponent} from './shared/screen-too-small/screen-too-small.component';


const routes: Routes = [


  {path: '**', component: NotFoundComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
