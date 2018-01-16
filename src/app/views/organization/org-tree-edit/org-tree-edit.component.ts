import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {OrgTreeService} from '../org-tree.service';
import 'rxjs/add/operator/take';
import * as v4 from 'uuid';
import {SK_ITEM_TYPE, SkItem, SkSection} from '../../../model/document';
import {OrgTreeNode} from '../../../model/org-tree';

@Component({
  selector: 'sk-org-tree-edit',
  templateUrl: './org-tree-edit.component.html',
  styleUrls: ['./org-tree-edit.component.scss']
})
export class OrgTreeEditComponent implements OnInit {
  @Input() isRTL: boolean;
  @ViewChild('tree') tree;
  @ViewChild('itemTreeTrigger') treeMenuTrigger;

  treeNode: TreeNode;
  nodes: Array<any> = [{id: '0', name: 'root', children: []}];
  tree_options: ITreeOptions;

  constructor(private zone: NgZone,
              private orgTreeService: OrgTreeService) {
  }

  ngOnInit() {
    this.tree_options = {
      rtl: this.isRTL,
      idField: 'id',
      displayField: 'name',
      childrenField: 'children',
      actionMapping: this.getTreeActionMapping(),
      allowDrag: (node) => {
        return true;
      },
      allowDrop: (element: any, to: any) => {
        // console.log(to)
        return !to.parent.data.type;
      }
    };

    this.orgTreeService.getOrgTreeFromJson$()
      .subscribe( orgTree => this.nodes = orgTree);
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


  /******************
   *  USER ACTIONS
   *****************/

  treeEditorClick(ev, node) {
    if (node.data.type) {
      return;
    }
    this.treeNode = node;
    setTimeout(() => this.openTreeMenu(ev), 0);
  }

  openTreeMenu(ev) {
    ev.preventDefault();
    this.treeMenuTrigger.openMenu();
  }


  inputClicked(ev) {
    ev.stopPropagation();
  }

  // called when a node was moved in the tree
  moveNode(ev) {
    console.log(this.nodes[0]);
    const tree = this.makeTempDoc(this.nodes[0]);
    this.orgTreeService.saveOrgTree(tree);
  }


  /******************
   *  Tree Operations
   *****************/

  private addChildItem(node) {
    if (!node.type) {
      const newId = v4.v4();
      node.data.children.push({id: newId, name: '', children: []});
      this.tree.treeModel.update();
      this.tree.treeModel.focusDrillDown();
    }
  }

  addBrotherItem(node, above?: boolean) {
    if (!node.type) {
      const indexInsert = above ? node.index : node.index + 1;
      node.parent.data.children.splice(indexInsert, 0, {name: '', children: []});
      setTimeout(() => this.tree.treeModel.update());
    }
  }

  private deleteItem(node) {
    node.parent.data.children.splice(node.index, 1);
    this.tree.treeModel.update();
  }

  /******************
   *  API
   *****************/
  reset() {
    this.nodes = [{name: '', children: []}];
  }

  newTree() {
    this.nodes = [{name: '', children: []}];
  }

  getTree() {
    // create saved representation of doc
    // const docToSave = this.makeTempDoc(this.nodes[0]);
    //
    // // add doc name from root node
    // return docToSave;

  }

  /*******************
   * build JSON tree
   ******************/

  private makeTempDoc = (sk): string => {
    const roots = this.tree.treeModel.roots;
    const result = [];
    roots.forEach( root => result.push(this.treeNodeToSkSection(root))) ;
    return JSON.stringify(result);
  }

  private treeNodeToSkSection(treeNode: TreeNode) {
      const node: OrgTreeNode = {};
      node.name = treeNode.data.name;
      if (treeNode.children) {
        node.children = [];
        treeNode.children.forEach(childNode => {
          node.children.push(this.treeNodeToSkSection(childNode));
        });
      }
      if (treeNode.data.isDoc) {
        node.docId = treeNode.data.docId;
        node.isDoc = true;
      } else {
        node.isDoc = false;
      }
      return node;
    }

}
