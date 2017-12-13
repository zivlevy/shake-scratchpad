import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import {AddOrgComponent} from './add-org/add-org.component';
import {MyMaterialModule} from '../../material-module/my--material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeService} from './home.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MyMaterialModule,
    HomeRoutingModule
  ],
  declarations: [
    HomepageComponent,
    AddOrgComponent
    ],
  providers: [
    HomeService
  ]
})
export class HomeModule { }
