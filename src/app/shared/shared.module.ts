import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpinnerComponent} from './spinner/spinner.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import {ImageCropperModule} from 'ng2-img-cropper';
import {NavUserComponent} from './nav-user/nav-user.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {CheckboxComponent} from './checkbox/checkbox.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CoreModule} from '../core/core.module';
import {NavAdminComponent} from './nav-admin/nav-admin.component';
import {DeleteApproveComponent} from './dialogs/delete-approve/delete-approve.component';
import {MaterialModule} from '../material/material.module';
import {ConfirmDialogComponent} from './dialogs/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from './dialogs/input-dialog/input-dialog.component';
import { NotAuthenticatedComponent } from './not-authenticated/not-authenticated.component';
import { ScreenTooSmallComponent } from './screen-too-small/screen-too-small.component';
import { SelectDialogComponent } from './dialogs/select-dialog/select-dialog.component';

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
    MaterialModule,
  ],
  declarations: [
    SpinnerComponent,
    UserProfileComponent,
    NavUserComponent,
    CheckboxComponent,
    NavAdminComponent,
    DeleteApproveComponent,
    ConfirmDialogComponent,
    InputDialogComponent,
    NotAuthenticatedComponent,
    ScreenTooSmallComponent,
    SelectDialogComponent
  ],
  exports: [
    SpinnerComponent,
    UserProfileComponent,
    NavUserComponent,
    NavAdminComponent,
    CheckboxComponent,
    DeleteApproveComponent
  ],
  entryComponents: [
    ConfirmDialogComponent,
    InputDialogComponent,
    SelectDialogComponent
  ]
})

export class SharedModule {
  static forRoot() {
    return {
      ngMudule: SharedModule,
      providers: []
    };
  }
}
