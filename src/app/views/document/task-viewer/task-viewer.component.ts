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

  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = false;
  searchResultsCount: number = 0;
  searchTaskArray: Array<number>;

  taskList: Array<SkSection>;
  viewTask: Array<SkSection | SkItem>;
  docName: string = '';
  constructor(private docService: DocumentService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.docJson) {
      this.docName = JSON.parse(this.docJson).data;
      this.taskList  = this.docService.SKTasksList(this.docJson);
      this.doSearch();
      this.currentTask = 0;
      this.setViewTask();
      console.log(this.taskList);
    }
  }

  doSearch(){
    if (this.isSearch && this.searchPhrase !== '') {
      this.searchResultsCount = 0;
      let arrCounter = 0;
      this.taskList.forEach( (item: any) => {
          let isFound = false;
        const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
          if (item.docs[0].data.match(new RegExp(ref, 'g'))) { isFound = true; }
        // item.docs[0].data = item.docs[0].data.replace(new RegExp(this.searchPhrase, 'g'), `<span style="background-color: lightcoral;">${this.searchPhrase}</span>`);
          item.docs[0].data = item.docs[0].data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
          // item.docs[0].data = item.docs[0].data.replace(/(\>[^\>\<]*)הנחיות([^\>\<]*\<)/g, '$1זיו$2');
          item.parents.forEach( (parent: SkSection) => {
            parent.data = parent.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
          });
          arrCounter++;
        }
      );
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
