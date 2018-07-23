import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {takeUntil} from 'rxjs/operators';
import {LanguageService} from '../../../core/language.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'sk-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  infoHeader: string;
  infoLines: Array<string>;
  direction: string = 'ltr';

  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) private data,
              private lngService: LanguageService,
  ) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);
    this.infoHeader = data.header;
    this.infoLines = data.lines;
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
