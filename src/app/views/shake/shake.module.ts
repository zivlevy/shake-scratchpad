import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ShakeRoutingModule} from './shake-routing.module';
import {ShakeHomePageComponent} from './shake-home-page/shake-home-page.component';
import {ShakeService} from './shake.service';
import {TranslateModule} from '@ngx-translate/core';
import {MyMaterialModule} from "../../material-module/my--material.module";

@NgModule({
    imports: [
        CommonModule,
        ShakeRoutingModule,
        TranslateModule.forChild(),
        MyMaterialModule
    ],
    providers: [ShakeService],
    declarations: [ShakeHomePageComponent]
})
export class ShakeModule {
}
