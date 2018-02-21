import {Component, Input, NgZone, OnChanges, OnInit, ViewChild} from '@angular/core';
import {IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {SK_ITEM_TYPE, SkItem, SkSection, SkTreeNode} from '../../../model/document';

import {v4} from 'uuid';


@Component({
  selector: 'sk-tree-doc',
  templateUrl: './tree-doc.component.html',
  styleUrls: ['./tree-doc.component.scss']
})
export class TreeDocComponent implements OnInit, OnChanges {

  @Input() isRTL: boolean;
  @Input() nodes = [];
  @Input() docData: any;

  @ViewChild('tree') tree;
  @ViewChild('itemTreeTrigger') treeMenuTrigger;
  isCtrlKey: boolean;
  treeNode: TreeNode;
  currentTreeNode: TreeNode; // the selected tree node
  tree_options: ITreeOptions;
  inEditorClick: boolean;

  constructor(private zone: NgZone) {
    // document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
  }

  ngOnInit() {
    // document.getElementsByTagName('html')[0].setAttribute('dir', this.isRTL ? 'rtl' : 'ltr');
    this.tree_options = {
      rtl: this.isRTL,
      idField: '_id',
      displayField: 'data',
      childrenField: 'nodes',
      actionMapping: this.getTreeActionMapping(),
      allowDrag: (node) => {
        return node.parent.parent;
      },
      allowDrop: (element: any, to: any) => {
        return (to.parent.parent && to.parent.data.nodes);
      }
    };
  }

  ngOnChanges() {
    if (this.docData) {
      console.log(JSON.parse(this.docData.data));
      this.nodes = [];
      this.nodes.push(JSON.parse(this.docData.data));

      setTimeout(() => {
        this.tree.treeModel.expandAll();
        console.log(this.tree);
      }, 0);
    }
  }


  /******************
   *  USER ACTIONS
   *****************/

  treeEditorClick(ev, node) {
    if (this.inEditorClick) {
      this.inEditorClick = false;
      return;
    }
    this.treeNode = node;
    setTimeout(() => this.openTreeMenu(ev), 0);
  }

  openTreeMenu(ev) {
    ev.preventDefault();
    this.treeMenuTrigger.openMenu();
  }


  private nodeMoved(ev) {
    this.currentTreeNode = ev.node;

  }

  private addChildItem(tree, node, section?: boolean) {
    if (node.data.nodes) {
      if (section) {
        node.data.nodes.push({data: '', nodes: []});
      } else {
        node.data.nodes.push({data: ''});
      }
      tree.update();
      tree.focusDrillDown();
    }
  }
  makeWarning (node) {
    node.data.type = SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING;
  }

  makeInfo( node){
    node.data.type = SK_ITEM_TYPE.SK_ITEM_TYPE_INFO;
  }

  addBrotherItem(tree, node, section?: boolean, above?: boolean) {
    if (!node.parent.parent) {return; }
    const indexInsert = above ? node.index : node.index + 1;
    if (section) {
      node.parent.data.nodes.splice(indexInsert, 0, {data: '', nodes: []});
    } else {
      node.parent.data.nodes.splice(indexInsert, 0, {data: ''});
    }

    setTimeout(() => tree.update());

  }

  private deleteItem(tree, node) {
    node.parent.data.nodes.splice(node.index, 1);
    tree.update();
  }

  private getTreeActionMapping(): IActionMapping {
    return {
      keys: {
        [KEYS.RIGHT]: null,
        [KEYS.LEFT]: null,
        [KEYS.DOWN]: null,
        [KEYS.UP]: null,
        [KEYS.SPACE]: null,
        [KEYS.ENTER]: null
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

  private editorOptions(node) {
    return {
      // key: 'flhg1ifwftfB-13jbH-9miA11iycwqufsvhiF3xsp==',
      key: 'lvnfclG5eiyyd1bz==',
      fontSizeSelection: true,
      multiLine: !node.children,
      fontSize: ['8', '10', '12', '14', '16', '18', '20', '24'],
      placeholderText: this.isRTL ? 'הכנס טקסט...' : 'Insert text',
      language: this.isRTL ? 'he' : 'en',
      charCounterCount: false,
      initOnClick: true,
      toolbarInline: true,
      toolbarVisibleWithoutSelection: false,
      disableRightClick: true,
      direction: this.isRTL ? 'rtl' : 'ltr',
      toolbarButtons: ['bold', 'italic', 'underline',  'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsSM:  ['bold', 'italic', 'underline',  'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsMD:  ['bold', 'italic', 'underline',  'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsXS:  ['bold', 'italic', 'underline',  'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      quickInsertTags: [''],
      events: {
        'froalaEditor.click': (e, editor) => {
          e.stopPropagation();
          this.inEditorClick = true;

        },
        'froalaEditor.focus':  (e, editor) => {
          console.log(node.data.data);
          this.tree.treeModel.setSelectedNode(node);
          this.tree.treeModel.setFocusedNode(node);
          this.tree.treeModel.setActiveNode(node, true);
        },
        'froalaEditor.initialized': (e, editor) => {
          editor.events.on('keydown', (ev) => {
            ev.stopPropagation();
            if (ev.originalEvent.key === 'ArrowDown' && ev.shiftKey) {
              console.log('add item');
              this.zone.run(() => {
                this.addBrotherItem(this.tree.treeModel, this.currentTreeNode, false);
              });
            } else if ( ev.originalEvent.key === 'Enter' && node.children) {
              const event = ev;
              this.zone.run(() => {
                this.addChildItem( this.tree.treeModel, this.currentTreeNode, false);
              });
            }
          });
        },
      }
    };
  }


  /******************
   *  API
   *****************/
  reset() {
    this.nodes = [{data: '', nodes: []}];
  }

  newDoc() {
    this.nodes = [{data: '', nodes: []}];
  }

  getDoc() {
    // create saved representation of doc
    const docToSave = this.makeTempDoc(this.nodes[0]);

    // add doc name from root node
    docToSave['name'] = this.stripHtml(this.nodes[0].data);

    return docToSave;

  }


  /******************
   *  HELPERS
   *****************/

  private makeTempDoc = (sk): { data: string, plainText: string } => {
    const plainText = {plainText: ''};
    const tree = this.treeNodeToSkSection(this.nodes[0], plainText);
    console.log(plainText);
    console.log(tree);
    return {data: JSON.stringify(tree), plainText: plainText.plainText};
  }

  private treeNodeToSkSection(treeNode, plainText: any): SkSection | SkItem {
    if (treeNode.nodes) {
      const section: SkSection = new SkSection();
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      section.data = treeNode.data;
      treeNode.nodes.forEach(node => {
        section.nodes.push(this.treeNodeToSkSection(node, plainText));
      });
      return section;
    } else {
      const item: SkItem = new SkItem();
      item.data = treeNode.data;
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      item.type = treeNode.type ? treeNode.type : SK_ITEM_TYPE.SK_ITEM_TYPE_INFO;
      return item;
    }
  }

  private stripHtml(str) {
    // Remove some tags
    str = str.replace(/<[^>]+>/gim, '');

    // Remove BB code
    str = str.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '$2 ');

    // Remove other staff;
    str = str.replace(/\&nbsp;/g, '');
    str = str.replace(/\&quot;/g, '');
    str = str.replace(/\&ndash;/g, '');

    return str;
  }
}
