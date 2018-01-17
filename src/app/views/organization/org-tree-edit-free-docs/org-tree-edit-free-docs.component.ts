import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {IActionMapping, ITreeOptions, TREE_ACTIONS} from "angular-tree-component";
import {OrgService} from "../org.service";

@Component({
  selector: 'sk-org-tree-edit-free-docs',
  templateUrl: './org-tree-edit-free-docs.component.html',
  styleUrls: ['./org-tree-edit-free-docs.component.scss']
})
export class OrgTreeEditFreeDocsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() isRTL: boolean;
  @ViewChild('tree') tree;
  nodes: Array<any> = [{id: '0', name: 'root', children: []}];
  tree_options: ITreeOptions;

  constructor(public orgService: OrgService) {
  }

  ngOnInit() {
    this.tree_options = {
      rtl: this.isRTL,
      displayField: 'name',
      childrenField: 'children',
      actionMapping: this.getTreeActionMapping(),
      allowDrag: (node) => {
        return true;
      },
      allowDrop: (element: any, to: any) => {
        // console.log(to)
        return false;
      }
    };

    this.orgService.getTreeOrgDocs$()
      .takeUntil(this.destroy$)
      .subscribe( docs => {
        this.nodes = docs;
      });
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
        click: TREE_ACTIONS.TOGGLE_ACTIVE,
        dblClick: null,
        contextMenu: null,
        expanderClick: TREE_ACTIONS.TOGGLE_EXPANDED,
        checkboxClick: TREE_ACTIONS.TOGGLE_SELECTED,
        drop: TREE_ACTIONS.MOVE_NODE
      },
    };
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
