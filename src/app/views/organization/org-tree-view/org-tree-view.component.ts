import {Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from "@angular/core";
import {OrgService} from '../org.service';
import {IActionMapping, ITreeOptions, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {SkDoc} from "../../../model/document";
import {AlgoliaDoc} from "../../../model/algolia-doc";

@Component({
  selector: 'sk-org-tree-view',
  templateUrl: './org-tree-view.component.html',
  styleUrls: ['./org-tree-view.component.scss']
})
export class OrgTreeViewComponent implements OnInit {
  @Input() isRTL: boolean;
  @ViewChild('tree') tree;

  @Output()
  selectedDoc: EventEmitter<SkDoc> = new EventEmitter() ;

  treeNode: TreeNode;
  nodes: Array<any> = [{id: '0', name: 'root', children: []}];
  tree_options: ITreeOptions;


  constructor(private zone: NgZone,
              private orgService: OrgService) {
  }

  ngOnInit() {
    this.tree_options = {
      rtl: this.isRTL,
      idField: 'id',
      displayField: 'name',
      childrenField: 'children',
      actionMapping: this.getTreeActionMapping(),
      allowDrag: false,
      allowDrop: false,
    };

    this.orgService.getOrgTreeFromJson$()
      .subscribe( orgTree => {
        console.log(orgTree);
        this.nodes = orgTree;
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
    if (node.data.isDoc) {
      const doc = new SkDoc();
      doc.name = node.data.name;
      doc.uid = node.data.id;
      this.selectedDoc.emit(doc);
    }
  }


}
