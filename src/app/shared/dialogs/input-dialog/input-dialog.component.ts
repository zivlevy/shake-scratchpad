import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {takeUntil} from 'rxjs/operators';
import {LanguageService} from '../../../core/language.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'sk-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  titleMessage: string;
  direction: string = 'ltr';
  oldValue: string = '';

  constructor(public dialogRef: MatDialogRef<InputDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private lngService: LanguageService,) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);
    this.titleMessage = data.msg;
    this.oldValue = data.value ? data.value : '';
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
