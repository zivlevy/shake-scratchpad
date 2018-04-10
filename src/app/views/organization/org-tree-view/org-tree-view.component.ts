import {
  AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output,
  ViewChild
} from '@angular/core';
import {OrgService} from '../org.service';
import {IActionMapping, ITreeOptions, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {SkDoc} from '../../../model/document';
import {LanguageService} from '../../../core/language.service';
import {Subject} from 'rxjs/Subject';
import {OrgTreeNode} from '../../../model/org-tree';
import {takeUntil} from 'rxjs/operators';
import {OrgUser} from '../../../model/org-user';
import * as v4 from 'uuid';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {InputDialogComponent} from '../../../shared/dialogs/input-dialog/input-dialog.component';
import {ToasterService} from '../../../core/toaster.service';

@Component({
    selector: 'sk-org-tree-view',
  templateUrl: './org-tree-view.component.html',
  styleUrls: ['./org-tree-view.component.scss']
})

export class OrgTreeViewComponent implements OnInit, OnDestroy, AfterViewInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isRTL: boolean = false;
  @ViewChild('tree') tree;
  @ViewChild('itemTreeTrigger') treeMenuTrigger;
  @Input() allowEdit: boolean = false;
  @Output() selectedDoc: EventEmitter<SkDoc> = new EventEmitter();

  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  inputDialogRef: MatDialogRef<InputDialogComponent>;

  treeNode: TreeNode;
  nodes: Array<OrgTreeNode> = [{id: '0', name: 'root', children: []}];
  tree_options: ITreeOptions;
  currentOrgUser: OrgUser;

  constructor(private zone: NgZone,
              private orgService: OrgService,
              private lngService: LanguageService,
              private dialog: MatDialog,
              private toaster: ToasterService) {
  }

  ngOnInit() {
    this.lngService.getDirection$()
      .takeUntil(this.destroy$)
      .subscribe(dir => {
        this.isRTL = (dir === 'rtl');
      });

    // get current orgUser
    this.orgService.getOrgUser$()
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(user => this.currentOrgUser = user);


  }

  ngAfterViewInit() {

    this.orgService.getOrgTreeByUser$()
      .subscribe(orgTree => {
        this.tree_options = {
          rtl: this.isRTL,
          idField: 'id',
          displayField: 'name',
          childrenField: 'children',
          actionMapping: this.getTreeActionMapping(),
          allowDrag: this.allowEdit && this.currentOrgUser && this.currentOrgUser.roles.editor,
          allowDrop: (element: any, to: any) => {
            if (! this.allowEdit) { return false; }
            if (to.parent.children) {
              const itemInParent = to.parent.children.find(item =>
              {
                if (element.data.isDoc)
                {
                  return item.data.docId === element.data.docId;
                } else {
                }

              });
              if (itemInParent && itemInParent !== element) {
                return false;
              }
            }
            return !to.parent.data.isDoc;
          }
        };
        this.nodes = orgTree;
        const firstRoot = this.tree.treeModel.roots[0];
        setTimeout(() => {
          // this.tree.treeModel.expandAll();
          // expand first level
          this.tree.treeModel.roots.forEach( root => {
            root.expand();
          });
          // console.log(this.tree);
        }, 0);
      }, err => console.log(err));

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
      doc.isPublish = node.data.isPublish;
      this.selectedDoc.emit(doc);
    }
  }

  treeRightClick(ev, node) {
    ev.preventDefault();
    if (!this.allowEdit) { return; }
    if (this.currentOrgUser.roles.editor || this.currentOrgUser.roles.viewer) {
      this.treeNode = node;
      setTimeout(() => this.treeMenuTrigger.openMenu(ev), 0);
    }

  }

  expandAll() {
    this.tree.treeModel.roots.forEach( root => {
      root.expandAll();
    });
  }

  collapseAll(){
    this.tree.treeModel.roots.forEach( root => {
      root.collapseAll();
    });
  }

  unPublishDoc() {
    if (!this.allowEdit) { return; }
    if (this.treeNode.data.isDoc && this.treeNode.data.isPublish) {
      this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          msg: 'Un-publish document?'
        }
      });

      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.orgService.unPublishDoc(this.treeNode.data.id)
              .then(() => this.toaster.toastInfo('Un-publish success'));
          }
        });
    }
  }

  publishDoc() {
    if (!this.allowEdit) { return; }
    if (this.treeNode.data.isDoc && !this.treeNode.data.isPublish) {
      this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          msg: 'Publish document?'
        }
      });

      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.orgService.publishDocById(this.treeNode.data.id);
          }
        });
    }
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

  /******************
   *  Tree Operations
   *****************/
  renameSection(node) {
    if (!this.allowEdit) { return; }
    this.inputDialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        msg: 'Update directory name',
        value: node.data.name
      }
    });

    this.inputDialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          node.data.name = result;
          this.saveTree();
        }
      });
  }

  private addChildItem(node) {
    if (!this.allowEdit) { return; }
    if (!node.type) {
      this.inputDialogRef = this.dialog.open(InputDialogComponent, {
        data: {
          msg: 'Insert directory name'
        }
      });

      this.inputDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            const newId = v4.v4();
            node.data.children.push({id: newId, name: result, children: []});
            this.tree.treeModel.update();
            // this.tree.treeModel.focusDrillDown();
            this.saveTree();
          }
        });
    }
  }


  addBrotherItem(node, above?: boolean) {
    if (!this.allowEdit) { return; }
    if (!node.type) {
      this.inputDialogRef = this.dialog.open(InputDialogComponent, {
        data: {
          msg: 'Insert directory name'
        }
      });

      this.inputDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            const newId = v4.v4();
            const indexInsert = above ? node.index : node.index + 1;
            node.parent.data.children.splice(indexInsert, 0, {name: result, children: []});
            this.tree.treeModel.update();
            // this.tree.treeModel.focusDrillDown();
            this.saveTree();
          }
        });
    }
    if (!node.type) {

      setTimeout(() => this.tree.treeModel.update());
    }
  }

   deleteItem(node) {
    if (!this.allowEdit) { return; }
    if (node.data.isDoc) {
      this.confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          msg: this.isRTL ? `למחוק את:  ${node.data.name} ?` : `Delete: ${node.data.name} ?`
        }
      });
      this.confirmDialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.orgService.deleteDoc(node.data.docId);
          }
        });
    }
    else if (node.children.length === 0) {
      node.parent.data.children.splice(node.index, 1);
      this.tree.treeModel.update();
      this.saveTree();
    }
  }

  removeDocFromTree (node) {
    if (!this.allowEdit) { return; }
    const tempDocId = node.data.docId;
    const tempName = node.data.name;
    node.parent.data.children.splice(node.index, 1);
    this.tree.treeModel.update();
    console.log(this.nodes);
    const nodesJson = JSON.stringify(this.nodes);
    const re = new RegExp(tempDocId, 'g');
    const count = (nodesJson.match(re) || [] ).length;
    if (count > 0) {
      this.saveTree();
    } else {
      this.nodes.push( {name: node.data.name, isDoc: true, isPublish: node.data.isPublish, docId: node.data.docId, id: node.data.docId });
      this.tree.treeModel.update();
      this.saveTree();
    }
  }


  private saveTree() {
    if (!this.allowEdit) { return; }
    const tree = this.orgService.makeJsonTree(this.tree.treeModel.roots);
    this.orgService.saveOrgTree(tree)
      .then(() => {
        console.log('finished');
      });
  }

  onMoveNode(ev) {
    if (!this.allowEdit) { return; }
    this.saveTree();
  }

  onCopyNode(ev){
    if (!this.allowEdit) { return; }
    this.saveTree();
  }

}
