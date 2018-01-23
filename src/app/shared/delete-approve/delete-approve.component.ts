import {Component, Inject, OnInit} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
  selector: 'sk-delete-approve',
  templateUrl: './delete-approve.component.html',
  styleUrls: ['./delete-approve.component.scss']
})
export class DeleteApproveComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteApproveComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  confirmClicked() {
    this.dialogRef.close(true);
  }
}
