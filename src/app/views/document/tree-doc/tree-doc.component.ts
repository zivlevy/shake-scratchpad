import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {IActionMapping, ITreeOptions, KEYS, TREE_ACTIONS, TreeNode} from 'angular-tree-component';
import {SK_ITEM_TYPE, SkItem, SkSection, SkTreeNode} from '../../../model/document';

import {v4} from 'uuid';
import * as _ from 'lodash';
import {environment} from '../../../../environments/environment';

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

  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = false;
  searchTemp: any = '';
  isReadyForSearch: boolean = false;
  @Output() editTreeClicked: EventEmitter<any> = new EventEmitter();

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

  ngOnChanges(changes: SimpleChanges) {
    // if the change is in the doc itself
    console.log(changes);
    if (changes.docData && !changes.docData.firstChange) {
      if (this.docData) {
        this.nodes = [];
        const myNodes = JSON.parse(this.docData.data);
        this.nodes.push(JSON.parse(this.docData.data));
        this.isReadyForSearch = true;
        this.searchTemp = _.cloneDeep(myNodes);
        this.initSearch();
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }

    }
    if (changes.isSearch && changes.isSearch.currentValue !== undefined && this.isReadyForSearch) {
      if (changes.isSearch.currentValue) {
        const docToSearch = this.getDoc().data;
        const myNodes = JSON.parse(docToSearch);
        this.searchTemp = _.cloneDeep(myNodes);
        this.initSearch();
      } else {
        this.nodes = [];
        this.nodes.push(this.searchTemp);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
    }

    if (changes.searchPhrase && changes.searchPhrase.currentValue !== undefined && this.isReadyForSearch) {
      if (this.isSearch && this.searchPhrase !== '') {
        this.initSearch();
      } else {
        this.nodes = [];
        this.nodes.push(this.searchTemp);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
    }

  }

  initSearch() {
    if (this.searchPhrase !== '') {
      const serachRes = this.doSearch(_.cloneDeep(this.searchTemp));
      this.nodes = [];
      this.nodes.push(serachRes);
      setTimeout(() => {
        this.tree.treeModel.expandAll();
      }, 0);
    }
  }

  doSearch(node) {
    const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
    node.data = node.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
    if (node.nodes) {
      node.nodes.forEach(childNode => this.doSearch(childNode));
    }
    return node;
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


  nodeMoved(ev) {
    this.currentTreeNode = ev.node;

  }

  addChildItem(tree, node, section?: boolean) {
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

  makeWarning(node) {
    node.data.type = SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING;
  }

  makeInfo(node) {
    node.data.type = SK_ITEM_TYPE.SK_ITEM_TYPE_INFO;
  }

  addBrotherItem(tree, node, section?: boolean, above?: boolean) {
    if (!node.parent.parent) {
      return;
    }
    const indexInsert = above ? node.index : node.index + 1;
    if (section) {
      node.parent.data.nodes.splice(indexInsert, 0, {data: '', nodes: []});
    } else {
      node.parent.data.nodes.splice(indexInsert, 0, {data: ''});
    }

    setTimeout(() => tree.update());

  }

  deleteItem(tree, node) {
    node.parent.data.nodes.splice(node.index, 1);
    tree.update();
  }

  getTreeActionMapping(): IActionMapping {
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

  editorOptions(node) {
    return {
      key: environment.froala.key,
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
      tableStyles: {
        'solid-lines': 'Solid Lines'
      },
      tableCellStyles: {
        'solid-lines': 'Solid Lines'
      },
      direction: this.isRTL ? 'rtl' : 'ltr',
      toolbarButtons: ['bold', 'italic', 'underline', 'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'outdent', 'indent', 'fontFamily', 'fontSize', '-', 'color', 'align', 'formatOL', 'formatUL',
        'insertLink', 'insertTable', 'undo', 'redo'],
      quickInsertTags: [''],
      events: {
        'froalaEditor.click': (e, editor) => {
          e.stopPropagation();
          this.inEditorClick = true;

        },
        'froalaEditor.focus': (e, editor) => {
          this.tree.treeModel.setSelectedNode(node);
          this.tree.treeModel.setFocusedNode(node);
          this.tree.treeModel.setActiveNode(node, true);
        },
        'froalaEditor.initialized': (e, editor) => {
          editor.events.on('keydown', (ev) => {
            ev.stopPropagation();
            if (ev.originalEvent.key === 'ArrowDown' && ev.shiftKey) {
              this.zone.run(() => {
                this.addBrotherItem(this.tree.treeModel, this.currentTreeNode, false);
              });
            } else if (ev.originalEvent.key === 'Enter' && node.children) {
              const event = ev;
              this.zone.run(() => {
                this.addChildItem(this.tree.treeModel, this.currentTreeNode, false);
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

  getDoc(removeSearch: boolean = false) {
    if (removeSearch && this.isSearch) {
      this.nodes = [];
      this.nodes.push(this.searchTemp);
      setTimeout(() => {
        this.tree.treeModel.expandAll();
      }, 0);
    }
    // create saved representation of doc
    const docToSave = this.makeTempDoc(this.nodes[0]);

    // add doc name from root node
    docToSave['name'] = this.stripHtml(this.nodes[0].data);

    return docToSave;

  }


  /******************
   *  HELPERS
   *****************/
  treeClicked() {
    this.editTreeClicked.emit();
  }

  private makeTempDoc = (sk): { data: string, plainText: string } => {
    const plainText = {plainText: ''};
    const tree = this.treeNodeToSkSection(this.nodes[0], plainText);
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
