import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import { HomeService } from '../views/home/home.service';
import {LanguadgeService} from './languadge.service';

@NgModule({
    imports: [
        CommonModule,
        AngularFireAuthModule,
        AngularFirestoreModule
    ],
    providers: [
      AuthService,
      HomeService,
      LanguadgeService],
    declarations: []
})
export class CoreModule {
}
