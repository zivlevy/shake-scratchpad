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

  searchPhrase: string = '';
  isSearch: boolean = false;
  searchSectionArray: Array<number> = [];
  currentSearchSectionIndex: number = 0;
  sectionList: Array<SkSection>;
  viewSection: Array<SkSection | SkItem>;
  docName: string = '';
  constructor(private docService: DocumentService
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log('Here');
    if (this.docJson) {
      this.docName = JSON.parse(this.docJson).data;
      this.sectionList  = this.docService.SKTasksList(this.docJson);
      this.doSearch();
      this.currentTask = 0;
      this.setViewSection();
      console.log(this.sectionList);
    }
  }

  doSearch(){

    if (this.isSearch && this.searchPhrase !== '') {
      this.searchSectionArray = [];
      this.currentSearchSectionIndex = 0;

      let arrCounter = 0;
      this.sectionList.forEach( (item: any) => {
          let isFound = false;
        const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
          if (item.docs[0].data.match(new RegExp(ref, 'g'))) { isFound = true; }
          item.docs[0].data = item.docs[0].data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
          item.parents.forEach( (parent: SkSection) => {
            if (parent.data.match(new RegExp(ref, 'g'))) { isFound = true; }
            parent.data = parent.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
          });
          if (isFound) {
            this.searchSectionArray.push(arrCounter);
          }
          arrCounter++;
        }
      );
      console.log(this.searchSectionArray);
    }
  }

  nextSection() {
    if (this.currentTask < this.sectionList.length - 1) {
      this.currentTask++;
      this.setViewSection();

    }
  }

  previousSection() {
    if (this.currentTask > 0) {
      this.currentTask--;
      this.setViewSection();
    }
  }

  nextSearchSection() {
    this.currentSearchSectionIndex = this.searchSectionArray.length - 1;
    for (let i = 0; i < this.searchSectionArray.length - 1; i++) {
      if (this.searchSectionArray[i] > this.currentTask) {
        this.currentSearchSectionIndex = i;
        break;
      }
    }
    this.currentTask = this.searchSectionArray[this.currentSearchSectionIndex];
    this.setViewSection();
  }

  previousSearchSection() {
    this.currentSearchSectionIndex = 0;
    for (let i = this.searchSectionArray.length - 1; i > 0 ; i--) {
      if (this.searchSectionArray[i] < this.currentTask) {
        this.currentSearchSectionIndex = i;
        break;
      }
    }
    this.currentTask = this.searchSectionArray[this.currentSearchSectionIndex];
    this.setViewSection();
  }

  setViewSection(){
    const task: any = this.sectionList[this.currentTask];
    this.viewSection = [];
    this.viewSection = [...task.parents, ...task.docs];
    console.log(this.viewSection);
  }

  toggleSearch() {
    this.isSearch = !this.isSearch;
  }
}
