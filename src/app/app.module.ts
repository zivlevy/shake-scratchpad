import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from 'angularfire2';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './shared/login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {OrganizationModule} from './views/organization/organization.module';
import {ShakeModule} from './views/shake/shake.module';
import {NotFoundComponent} from './shared/not-found/not-found.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {HomepageComponent} from './homepage/homepage.component';

import {TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader} from '@ngx-translate/core';
import {MyMaterialModule} from './material-module/my--material.module';
import {QuillModule} from 'ngx-quill';
import { SignupComponent } from './shared/signup/signup.component';
import { SpinnerComponent } from './shared/spinner/spinner.component'

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        NotFoundComponent,
        NavbarComponent,
        HomepageComponent,
        SignupComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        RouterModule,
        HttpClientModule,
        QuillModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MyMaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        CoreModule,
        ShakeModule,
        OrganizationModule,
        AppRoutingModule    // <==== allways last !
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}


export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
