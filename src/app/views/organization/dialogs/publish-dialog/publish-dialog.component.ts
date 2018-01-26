import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'sk-publish-dialog',
  templateUrl: './publish-dialog.component.html',
  styleUrls: ['./publish-dialog.component.scss']
})
export class PublishDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<PublishDialogComponent>) { }

  ngOnInit() {
  }

  publish() {
    this.dialogRef.close('publish');
  }

  publishSame() {
    this.dialogRef.close('update');
  }

}
