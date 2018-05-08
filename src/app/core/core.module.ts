import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AuthService} from './auth.service';
import {HomeService} from '../views/home/home.service';
import {LanguageService} from './language.service';
import {ImageService} from './image.service';
import {FirestoreService} from './firestore.service';
import {SafeHtmlPipe} from './safe-html.pipe';
import {AlgoliaService} from './algolia.service';
import { SetDirectionDirective } from './set-direction.directive';
import {DataPackageService} from './data-package.service';
import {FileService} from './file.service';
import {ToasterService} from './toaster.service';
import {MediaService} from './media.service';
import {EmailService} from './email.service';

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
    ImageService,
    AlgoliaService,
    SetDirectionDirective,
    DataPackageService,
    FileService,
    ToasterService,
    MediaService,
    EmailService
  ],
  declarations: [SafeHtmlPipe, SetDirectionDirective],
  exports: [SafeHtmlPipe]
})
export class CoreModule {
}
