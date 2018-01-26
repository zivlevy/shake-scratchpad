import {Directive, HostBinding} from '@angular/core';
import {LanguageService} from './language.service';

@Directive({
  selector: '[skSetDirection]'
})
export class SetDirectionDirective {
  @HostBinding('dir') hostDirection;
  constructor(private lngService: LanguageService) {
    lngService.getDirection$()
      .subscribe( dir => this.hostDirection = dir);
  }

}
