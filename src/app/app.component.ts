import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './core/auth.service';
import {LanguageService} from "./core/language.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    rtl = true;
    param = {value: 'world'};
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
              console.log(lng)
                // the lang to use, if the lang isn't available, it will use the current loader to get them
                this.translate.use(lng);
                lng === 'he' ? this.rtl = true : this.rtl = false;
            });

    }



    valChanged(e){
        console.log(e);
        this.content = e.html;
    }
}
