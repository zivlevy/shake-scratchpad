import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './core/auth.service';
import {LanguageService} from './core/language.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


    rtl = true;
    content;
    constructor(private translate: TranslateService,
                private authService: AuthService,
                private lngService: LanguageService) {

        translate.setDefaultLang('en');
        this.lngService.setLanguadge('en');
    }

    ngOnInit() {

      this.lngService.getLanguadge$()
        .subscribe(lng => {
          // the lang to use, if the lang isn't available, it will use the current loader to get them
          this.translate.use(lng);
          lng === 'he' ? this.rtl = true : this.rtl = false;
          const bodyRoot: HTMLElement = <HTMLElement> document.getElementsByTagName('body')[0];
          if (bodyRoot != null) {
            if (lng === 'he') {
              bodyRoot.style.fontFamily = 'Rubik';
            } else {
              bodyRoot.style.fontFamily = 'Roboto';
            }
          }
          const htmlRoot: HTMLElement = <HTMLElement> document.getElementsByTagName('html')[0];
          if (htmlRoot != null) {
            if (lng === 'he') {
              htmlRoot.style.fontFamily = 'Rubik';
            } else {
              htmlRoot.style.fontFamily = 'Roboto';
            }
          }
          const matCard: HTMLElement = <HTMLElement> document.getElementsByTagName('mat-card')[0];
          if (matCard != null) {
            if (lng === 'he') {
              matCard.style.fontFamily = 'Rubik';
            } else {
              matCard.style.fontFamily = 'Roboto';
            }
          }

        });
    }

}
