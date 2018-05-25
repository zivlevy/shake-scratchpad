import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {OrganizationModule} from './views/organization/organization.module';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader} from '@ngx-translate/core';
import {LoginComponent} from './shared/login/login.component';
import {SignupComponent} from './shared/signup/signup.component';
import {HomeModule} from './views/home/home.module';
import {ScrpComponent} from './scrp/scrp.component';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TooltipModule, ButtonsModule} from 'ngx-bootstrap';
import {ModalModule} from 'ngx-bootstrap/modal';
import {SharedModule} from './shared/shared.module';
import {Ng2FileInputModule} from 'ng2-file-input';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DocumentModule} from './views/document/document.module';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {MaterialModule} from './material/material.module';
import {AdminModule} from './views/admin/admin.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AuthGuard} from './shared/guards/auth.guard';
import {AngularFireStorageModule} from 'angularfire2/storage';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    LoginComponent,
    SignupComponent,
    ScrpComponent,
  ],
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    NgxSpinnerModule,
    BrowserAnimationsModule,
    environment.production ? ServiceWorkerModule.register('/ngsw-worker.js') : [],
    BsDropdownModule.forRoot(),
    BrowserModule,
    MaterialModule,
    FlexLayoutModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    TooltipModule.forRoot(),
    Ng2FileInputModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    LazyLoadImageModule,
    AdminModule,
    CoreModule,
    HomeModule,
    DocumentModule,
    OrganizationModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })    // <==== allways last !
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]

})
export class AppModule {

}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
