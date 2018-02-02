import {Component, EventEmitter, Input, NgZone, OnChanges, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {OrgService} from '../org.service';
import {IActionMapping, ITreeOptions, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {SkDoc} from '../../../model/document';
import {AlgoliaDoc} from '../../../model/algolia-doc';
import {LanguageService} from '../../../core/language.service';
import {Subject} from 'rxjs/Subject';
import {OrgTreeNode} from '../../../model/org-tree';

@Component({
  selector: 'sk-org-tree-view',
  templateUrl: './org-tree-view.component.html',
  styleUrls: ['./org-tree-view.component.scss']
})
export class OrgTreeViewComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isRTL: boolean = false;
  @ViewChild('tree') tree;

  @Output()
  selectedDoc: EventEmitter<SkDoc> = new EventEmitter();

  treeNode: TreeNode;
  nodes: Array<OrgTreeNode> = [{id: '0', name: 'root', children: []}];
  tree_options: ITreeOptions;


  constructor(private zone: NgZone,
              private orgService: OrgService,
              private lngService: LanguageService) {
  }

  ngOnInit() {
    this.lngService.getDirection$()
      .takeUntil(this.destroy$)
      .subscribe(dir => {
        this.isRTL = (dir === 'rtl');
      });

    this.orgService.getOrgTreeByUser$()
      .subscribe(orgTree => {
        this.tree_options = {
          rtl: this.isRTL,
          idField: 'id',
          displayField: 'name',
          childrenField: 'children',
          actionMapping: this.getTreeActionMapping(),
          allowDrag: this.isRTL,
          allowDrop: false,
        };
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

  treeRightClick( ev, node) {
    ev.preventDefault();
    console.log(node);
    if (node.data.isDoc && node.data.isPublish) {
      this.orgService.unPublishDoc(node.data.id);
    }
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }


}
