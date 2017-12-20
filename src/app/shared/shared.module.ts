import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [
    SpinnerComponent,
    UserProfileComponent,
  ],
  exports: [
    SpinnerComponent
  ]})

export class SharedModule {
  static forRoot() {
    return {
      ngMudule: SharedModule,
      providers: []
    };
  }
}
