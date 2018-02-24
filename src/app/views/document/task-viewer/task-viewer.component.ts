import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DocumentService} from '../document.service';
import {SkItem, SkSection} from '../../../model/document';

@Component({
  selector: 'sk-task-viewer',
  templateUrl: './task-viewer.component.html',
  styleUrls: ['./task-viewer.component.scss']
})
export class TaskViewerComponent implements OnInit, OnChanges {

  @Input() isRTL: boolean;
  @Input() isNumbering: boolean = true;
  @Input() docJson: string;
  @Input() ident: number = 10;
  @Input() currentTask: number = 0;

  taskList: Array<SkSection>;
  viewTask: Array<SkSection | SkItem>;
  constructor(private docService: DocumentService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.docJson) {
      this.taskList  = this.docService.SKTasksList(this.docJson);
      this.currentTask = 0;
      this.setViewTask();
      console.log(this.taskList);
    }
  }

  nextTask() {
    if (this.currentTask < this.taskList.length - 1) {
      this.currentTask++;
      this.setViewTask();

    }
  }

  previousTask() {
    if (this.currentTask > 0) {
      this.currentTask--;
      this.setViewTask();
    }
  }

  setViewTask(){
    const task: any = this.taskList[this.currentTask];
    this.viewTask = [];
    this.viewTask = [...task.parents, ...task.docs];
    console.log(this.viewTask);
  }

}
