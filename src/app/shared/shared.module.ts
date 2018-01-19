import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ImageCropperModule} from 'ng2-img-cropper';
import { NavUserComponent } from './nav-user/nav-user.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import { CheckboxComponent } from './checkbox/checkbox.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CoreModule} from '../core/core.module';
import { NavAdminComponent } from './nav-admin/nav-admin.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    BsDropdownModule,
    NgxSpinnerModule,
    ImageCropperModule,
    FlexLayoutModule,

  ],
  declarations: [
    SpinnerComponent,
    UserProfileComponent,
    NavUserComponent,
    CheckboxComponent,
    NavAdminComponent
  ],
  exports: [
    SpinnerComponent,
    UserProfileComponent,
    NavUserComponent,
    NavAdminComponent,
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
