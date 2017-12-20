import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ImageCropperComponent} from "ng2-img-cropper";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterModule

  ],
  declarations: [
    SpinnerComponent,
    UserProfileComponent,
    ImageCropperComponent
  ],
  exports: [
    SpinnerComponent,
    UserProfileComponent,
    ImageCropperComponent
  ]})

export class SharedModule {
  static forRoot() {
    return {
      ngMudule: SharedModule,
      providers: []
    };
  }
}
