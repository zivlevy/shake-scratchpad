import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SkItem, SkSection} from '../../../model/document';
import {DocumentService} from '../document.service';
import {IActionMapping, TREE_ACTIONS} from "angular-tree-component";

@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit, OnChanges {
  @Input() isRTL: boolean;
  @Input() isNumbering: boolean = true;
  @Input() isDocMap: boolean = false;
  @Input() docJson: string;
  @Input() ident: number = 10;
  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = false;

  @ViewChild('tree') tree;

  docList: Array<SkSection | SkItem>;
  nodes;
  options;

  constructor(private docService: DocumentService
  ) {
  }

  ngOnInit() {


  }

  ngOnChanges() {


    if (this.docJson) {
      const docObject = JSON.parse(this.docJson);
      this.docList = this.docService.SkTreeListFromJSON(docObject);
      if (this.isDocMap) {
        this.genDocMap(docObject);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
      this.doSearch();
    }
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

  treeClicked(ev, node) {
    console.log(node);

  }

  treeRightClick(ev, node) {
    console.log(node);
  }

  doSearch() {
    if (this.isSearch && this.searchPhrase !== '') {
      this.docList.forEach((item: any) => {
        const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
        item.data = item.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
      });
    }
  }

}
