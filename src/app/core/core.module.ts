import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {HomeService} from '../views/home/home.service';
import {LanguageService} from './language.service';
import {ImageService} from './image.service';
import {FirestoreService} from './firestore.service';
import {UserService} from './user.service';
import {SafeHtmlPipe} from './safe-html.pipe';
import {AlgoliaService} from './algolia.service';
import { SetDirectionDirective } from './set-direction.directive';
import {DataPackageService} from './data-package.service';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [
    AuthService,
    HomeService,
    LanguageService,
    FirestoreService,
    UserService,
    ImageService,
    AlgoliaService,
    SetDirectionDirective,
    DataPackageService
  ],
  declarations: [SafeHtmlPipe, SetDirectionDirective],
  exports: [SafeHtmlPipe]
})
export class CoreModule {
}
