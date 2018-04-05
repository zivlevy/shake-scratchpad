import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import {AddOrgComponent} from './add-org/add-org.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeService} from './home.service';
import {TranslateModule} from '@ngx-translate/core';
import {TooltipModule} from 'ngx-bootstrap';
import {SharedModule} from '../../shared/shared.module';
import { HomeContentComponent } from './home-content/home-content.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    HomeRoutingModule,
    TranslateModule,
    SharedModule,
    NgxSpinnerModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    HomepageComponent,
    AddOrgComponent,
    HomeContentComponent,
    ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }
