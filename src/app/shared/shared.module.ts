import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ImageCropperComponent} from 'ng2-img-cropper';
import { NavUserComponent } from './nav-user/nav-user.component';
import {BsDropdownModule} from "ngx-bootstrap";
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    BsDropdownModule

  ],
  declarations: [
    SpinnerComponent,
    UserProfileComponent,
    ImageCropperComponent,
    NavUserComponent,
    CheckboxComponent
  ],
  exports: [
    SpinnerComponent,
    UserProfileComponent,
    ImageCropperComponent,
    NavUserComponent,
    CheckboxComponent
  ]})

export class SharedModule {
  static forRoot() {
    return {
      ngMudule: SharedModule,
      providers: []
    };
  }
}
