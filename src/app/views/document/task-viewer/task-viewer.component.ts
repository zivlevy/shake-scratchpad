import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {DocumentService} from '../document.service';
import {SkItem, SkSection} from '../../../model/document';
import {IActionMapping, TREE_ACTIONS} from 'angular-tree-component';
import {MediaService} from '../../../core/media.service';

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
  @Input() isDocMap: boolean = false;

  @ViewChild('tree') tree;
  @ViewChild('drawer') drawer;


  searchPhrase: string = '';
  isSearch: boolean = false;
  searchSectionArray: Array<number> = [];
  currentSearchSectionIndex: number = 0;
  sectionList: Array<SkSection>;
  viewSection: Array<SkSection | SkItem>;
  docName: string = '';
  nodes;
  options;
  smallScreen: boolean = false;

  constructor(private docService: DocumentService,
              private mediaService: MediaService) {

  }

  ngOnInit() {
    this.mediaService.getSmallScreen$()
      .subscribe(isSmall => {
        this.smallScreen = isSmall;
      });
  }

  ngOnChanges() {
    if (this.docJson) {
      const docObject = JSON.parse(this.docJson);
      // this.docName = JSON.parse(this.docJson).data;
      this.docName = docObject.data;

      this.sectionList  = this.docService.SKTasksList(this.docJson);
      this.doSearch();
      this.currentTask = 0;
      this.setViewSection();
      if (this.isDocMap) {
        this.genDocMap(docObject);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
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
  }

  toggleSearch() {
    this.isSearch = !this.isSearch;
  }

  genDocMap(docObject) {
    this.nodes = this.docService.getMapTreeFromDocJson(docObject);

    this.options = {
      rtl: this.isRTL,
      actionMapping: this.getTreeActionMapping(),

    };
  }

  private getTreeActionMapping(): IActionMapping {
    return {
      keys: {
        // [KEYS.RIGHT]: null,
        // [KEYS.LEFT]: null,
        // [KEYS.DOWN]: null,
        // [KEYS.UP]: null,
        // [KEYS.SPACE]: null,
        // [KEYS.ENTER]: null
      },
      mouse: {
        click: TREE_ACTIONS.TOGGLE_EXPANDED,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        checkboxClick: TREE_ACTIONS.TOGGLE_SELECTED,
        drop: TREE_ACTIONS.MOVE_NODE
      },
    };
  }

  treeClicked (ev, node) {
    if (this.smallScreen) {
      this.drawer.close();
    }
    let taskNumToLocate = node.data.numbering.toString();
    this.currentTask = this.getTaskNumber(taskNumToLocate);
    while (this.currentTask < 0) {
      taskNumToLocate = taskNumToLocate + '.1';
      this.currentTask = this.getTaskNumber(taskNumToLocate);
    }
    this.setViewSection();
  }

  getTaskNumber(numbering: string) {
    let task = 0;
    for (const section of this.sectionList)  {
      if (section.parents[section.parents.length - 1].numbering === numbering) {
        return task;
      } else {
        task++;
      }
    }
    return -1;
  }

  treeRightClick(ev, node) {
    console.log(node);
  }
}
