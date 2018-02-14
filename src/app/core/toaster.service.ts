import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Direction} from '@angular/cdk/bidi';
import {LanguageService} from './language.service';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ToasterService {
  direction: Direction = 'ltr';

  constructor(private snackBar: MatSnackBar,
              private lngService: LanguageService,
              private translate: TranslateService) {
    this.lngService.getDirection$()
      .subscribe( dir => this.direction = <Direction>dir);
  }

  toastSuccess(msg, duration: number = 3000) {
    this.translate.get(msg).subscribe((res: string) => {
      this.snackBar.open(res, null, {
          duration,
          direction: this.direction,
          panelClass: ['toastSuccess']
        }
      );
    });

  }

  toastInfo(msg, duration: number = 3000) {
    this.translate.get(msg).subscribe((res: string) => {
      this.snackBar.open(res, null, {
          duration,
          direction: this.direction,
          panelClass: ['toastInfo']
        }
      );
    });
  }

  toastError(msg, duration: number = 3000) {
    this.translate.get(msg).subscribe((res: string) => {
      this.snackBar.open(res, null, {
          duration,
          direction: this.direction,
          panelClass: ['toastErrorw']
        }
      );
    });
  }

}
