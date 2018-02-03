import {Component, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import 'rxjs/add/operator/take';
import * as v4 from 'uuid';
import {SK_ITEM_TYPE, SkItem, SkSection} from '../../../model/document';
import {OrgTreeNode} from '../../../model/org-tree';
import {OrgService} from '../org.service';

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
              private orgService: OrgService) {
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

        if (to.parent.children) {
          const itemInParent = to.parent.children.find(item =>
          {
            console.log(item);
            return item.data.docId === element.data.docId;
          });
          if (itemInParent && itemInParent !== element) {
            return false;
          }
        }
        return !to.parent.data.isDoc;
      }
    };

    this.orgService.getOrgTreeByUser$()
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


  /******************
   *  USER ACTIONS
   *****************/

  treeEditorClick(ev, node) {
    ev.preventDefault();
    ev.stopPropagation();
    if (node.data.type) {
      return;
    }
    this.treeNode = node;
    setTimeout(() => this.openTreeMenu(ev), 0);
  }

  openTreeMenu(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    this.treeMenuTrigger.openMenu();
  }


  inputClicked(ev) {
    // ev.stopPropagation();
  }

  // called when a node was moved in the tree
  moveNode(ev) {
    console.log(ev);
  }

  copyNode(ev) {
    console.log(ev);
  }
  saveTree() {
    const tree = this.orgService.makeJsonTree(this.tree.treeModel.roots);
    this.orgService.saveOrgTree(tree);
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

  // /******************
  //  *  API
  //  *****************/
  // reset() {
  //   this.nodes = [{name: '', children: []}];
  // }
  //
  // newTree() {
  //   this.nodes = [{name: '', children: []}];
  // }


}
