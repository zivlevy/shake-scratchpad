import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Subject} from 'rxjs/Subject';
import {LanguageService} from '../../../core/language.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'sk-delete-approve',
  templateUrl: './delete-approve.component.html',
  styleUrls: ['./delete-approve.component.scss']
})
export class DeleteApproveComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  public confirmMessage: string;
  direction: string = 'ltr';

  constructor(public dialogRef: MatDialogRef<DeleteApproveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private lngService: LanguageService) {
    this.lngService.getDirection$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(dir => this.direction = dir);
    this.confirmMessage = data.msg;
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
