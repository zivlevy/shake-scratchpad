import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LanguageService} from '../../../core/language.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-select-dialog',
  templateUrl: './select-dialog.component.html',
  styleUrls: ['./select-dialog.component.scss']
})
export class SelectDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  public selectMessage: string;
  direction: string = 'ltr';

  constructor(public dialogRef: MatDialogRef<SelectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private lngService: LanguageService,
              ) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);
    this.selectMessage = data.msg;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
