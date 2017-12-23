import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import {AddOrgComponent} from './add-org/add-org.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeService} from './home.service';
import {TranslateModule} from '@ngx-translate/core';
import {TooltipModule} from 'ngx-bootstrap';
import {SharedModule} from "../../shared/shared.module";
import { HomeContentComponent } from './home-content/home-content.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    HomeRoutingModule,
    TranslateModule,
    SharedModule
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
