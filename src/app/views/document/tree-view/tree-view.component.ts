import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import {SkItem, SkSection, SkTreeNode} from '../../../model/document';
import {TreeNode} from '@angular/router/src/utils/tree';
import {LanguageService} from "../../../core/language.service";

@Component({
  selector: 'sk-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  static currentDragedObject;
  static isStop: boolean = false;
  @ViewChild('wrapper') wrapper;
  @ViewChild('itemMenuTrigger') itemMenuTrigger;

  @ViewChild('sectionMenuTrigger') sectionMenuTrigger;
  @ViewChild('itemMenu') itemMenu;

  @ViewChild('itemTreeTrigger') treeMenuTrigger;
  @ViewChild('treeMenu') treeMenu;

  @Input() isRTL: boolean;
  @Input() treeNode: SkTreeNode;
  @Input() identMargin: number;
  @Output() treeChange: EventEmitter<null> = new EventEmitter();

  isHoverSeperator: boolean;
  isHoverSection: boolean;


  // editor
  public options;
  inEditorClick: boolean;

  constructor(private lngService: LanguageService) {
    document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
  }

  openTreeMenu(ev) {
    ev.preventDefault();
    if (this.treeNode.isRoot) {return; }
    this.treeMenuTrigger.openMenu();
  }

  treeEditorClick(ev) {
    if (this.treeNode.isRoot) {return; }
    if (this.inEditorClick) {
      this.inEditorClick = false;
      return;
    }
    this.openTreeMenu(ev);
  }

  openItemMenu(ev) {
    ev.preventDefault();
    this.itemMenuTrigger.openMenu();
  }

  openSectionMenu(ev) {
    ev.preventDefault();
      this.sectionMenuTrigger.openMenu();
  }

  itemEditorClick(ev) {
    if (this.inEditorClick) {
      this.inEditorClick = false;
      return;
    }
    this.openItemMenu(ev);
  }

  sectionEditorClick(ev) {
    if (this.inEditorClick) {
      this.inEditorClick = false;
      return;
    }
    this.openSectionMenu(ev);
  }

  ngOnInit() {
    // editor options
    this.options = {
      fontSizeSelection: true,
      fontSize: ['8', '10', '12', '14', '18', '20', '24'],
      multiLine: this.treeNode.children ? false : true,
      disableRightClick: true,
      placeholderText: this.isRTL ? 'הכנס טקסט...' : 'Insert text',
      charCounterCount: false,
      initOnClick: true,
      toolbarInline: true,
      direction: this.isRTL ? 'rtl' : 'ltr',
      toolbarButtons: ['bold', 'italic', 'underline', 'strikeThrough', 'align', 'subscript', 'superscript', '-', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'indent', 'outdent', '-', 'insertImage', 'insertLink', 'insertFile', 'insertVideo', 'undo', 'redo'],
      toolbarVisibleWithoutSelection: false,
      events: {
        'froalaEditor.initialized': (e, editor) => {
          editor.events.on('drop', (ev) => {
            ev.preventDefault();
            TreeViewComponent.isStop = true;
          }, true);
        },
        'froalaEditor.click': (e, editor) => {
          console.log('click');
          this.inEditorClick = true;
          e.stopPropagation();
        },
        'froalaEditor.keyup' :  (e, editor, keyupEvent) => {
        // Do something here.
          console.log(e)
        if (keyupEvent.originalEvent.code === 'KeyZ' && keyupEvent.ctrlKey) {
          editor.selection.clear();
          this.deleteItem();
        }
      }
      }
    };

    // set identation
    if (this.isRTL) {
      this.wrapper.nativeElement.style.marginRight = this.identMargin + 'px';
    } else {
      this.wrapper.nativeElement.style.marginLeft = this.identMargin + 'px';
    }
  }

  treeChanged() {
    this.treeChange.emit();
  }

  textChange(ev) {
    this.treeNode.plainText = ev.text;
  }

  /********************
   * DnD item
   ********************/
  dragStartItem(ev, node) {
    ev.stopPropagation();
    if (ev.dataTransfer.types.length > 0) return;
    console.log('==== drag item start');
    const temp = _.cloneDeep(node);
    delete temp.parent;
    console.log(temp);
    const t = JSON.stringify(temp);
    console.log(t);
    ev.dataTransfer.setData('skItem', t);
    ev.dataTransfer.dropEffect = 'move';
    if (!this.isRTL) ev.dataTransfer.setDragImage(ev.target, 20, 0);
    TreeViewComponent.currentDragedObject = this.treeNode;
  }

  dragEndItem(ev) {
    ev.stopPropagation();
    console.log(TreeViewComponent.isStop);

    console.log(this.treeNode);
    if (ev.dataTransfer.dropEffect !== 'none' && !TreeViewComponent.isStop) {
      console.log('===== item drop end =========');
      this.treeNode.parent.children.forEach((item, index, array) => {
        console.log('remove');
        if (item === TreeViewComponent.currentDragedObject) {
          array.splice(index, 1);
        }
      });
      this.treeChanged();
    }
    TreeViewComponent.isStop = false;
  }

  /********************
   * DnD Section
   ********************/
  dragStartSection(ev, node) {
    ev.stopPropagation();
    const temp = _.cloneDeep(node);
    this.removeParents(temp);
    const t = JSON.stringify(temp);
    ev.dataTransfer.setData('skSection', t);
    ev.dataTransfer.dropEffect = 'move';
    if (!this.isRTL) ev.dataTransfer.setDragImage(ev.target, 20, 0);
    TreeViewComponent.currentDragedObject = this.treeNode;
  }

  dragEndSection(ev) {
    ev.stopPropagation();
    console.log(ev.dataTransfer.dropEffect);

    if (ev.dataTransfer.dropEffect !== 'none') {
      this.treeNode.parent.children.forEach((item, index, array) => {
        if (item === TreeViewComponent.currentDragedObject) {
          array.splice(index, 1);
        }
      });
      console.log('drag end');
      this.treeChanged();
    }
  }

  onDragEnterSection(ev) {
    ev.preventDefault();

  }

  onDragOverSection(ev) {
    ev.preventDefault();
    const transferTypes = [...ev.dataTransfer.types];
    console.log(transferTypes.length);

    if ((!transferTypes.includes('skitem')
        && !transferTypes.includes('sksection'))
      || transferTypes.length > 1
      || this.findParentExists(this.treeNode)

    ) {
      console.log(ev.dataTransfer.dropEffect);
      ev.dataTransfer.dropEffect = 'none';
    } else {
      this.isHoverSection = true;
    }
  }

  onDropSection(ev) {
    console.log('==== drop section');
    ev.preventDefault();
    let tmpTreeNode: SkTreeNode;

    const skItemJSON = ev.dataTransfer.getData('skItem');
    if (skItemJSON) tmpTreeNode = JSON.parse(skItemJSON);

    const skSectionJSON = ev.dataTransfer.getData('skSection');
    if (skSectionJSON) tmpTreeNode = JSON.parse(skSectionJSON);

    tmpTreeNode.parent = this.treeNode;
    this.addParents(tmpTreeNode);
    this.treeNode.children.push(tmpTreeNode);
    this.isHoverSection = false;
  }

  onDragLeaveSection(ev) {
    console.log('drag leave section');
    ev.preventDefault();
    this.isHoverSection = false;
  }

  /********************
   * DnD Seperator item
   ********************/
  onDropSeperator(ev) {
    ev.preventDefault();
    this.isHoverSeperator = false;
    console.log('===============> drop seperator');
    let tmpTreeNode: SkTreeNode;
    const skItemJSON = ev.dataTransfer.getData('skItem');
    if (skItemJSON) tmpTreeNode = JSON.parse(skItemJSON);

    const skSectionJSON = ev.dataTransfer.getData('skSection');
    if (skSectionJSON) tmpTreeNode = JSON.parse(skSectionJSON);

    tmpTreeNode.parent = this.treeNode.parent;
    const insertIndex = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    this.addParents(tmpTreeNode);
    this.treeNode.parent.children.splice(insertIndex, 0, tmpTreeNode);

  }

  onDragOverSeperator(ev) {
    ev.preventDefault();
    console.log('drag Over seperator');
    const transferTypes = [...ev.dataTransfer.types];
    if ((!transferTypes.includes('skitem')
        && !transferTypes.includes('sksection'))
      || transferTypes.length > 1
      || this.findParentExists(this.treeNode)

    ) {
      ev.dataTransfer.dropEffect = 'none';
    } else {
      this.isHoverSeperator = true;
    }
  }

  onDragLeaveSeperator(ev) {
    console.log('drag leave seperator');
    ev.preventDefault();
    this.isHoverSeperator = false;
  }

  /*************
   * DnD Helpers
   *************/
  removeParents(treeNode: SkTreeNode) {
    if (treeNode.children) {
      treeNode.children.forEach(child => this.removeParents(child));
    }
    delete treeNode.parent;
  }

  addParents(treeNode: SkTreeNode) {
    if (treeNode.children) {
      treeNode.children.forEach(child => {
        child.parent = treeNode;
        this.addParents(child);
      });
    }
  }

  findParentExists(treeNode: SkTreeNode): boolean {
    return this.findNodeInTree(TreeViewComponent.currentDragedObject, treeNode);
  }

  findNodeIndexInParent(node: SkTreeNode, parent: SkTreeNode): number {

    let nodeIndex: number = -1;
    parent.children.forEach((child, index) => {
      console.log(child);
      if (child === node) nodeIndex = index;
    });
    return nodeIndex;
  }

  findNodeInTree(treeNode: SkTreeNode, node: SkTreeNode): boolean {
    if (treeNode === node) {
      return true;
    }
    if (treeNode.children) {
      let isParentExists = false;
      treeNode.children.forEach(child => {

        if (this.findNodeInTree(child, node)) {
          isParentExists = true;
        }
      });
      return isParentExists;
    }
    return false;
  }


  /*****************
   * user actions
   *****************/
  addItemBefore() {
    const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.parent = this.treeNode.parent;
    this.treeNode.parent.children.splice(index, 0, tmpTreeNode);
  }

  addItemAfter() {
    const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.parent = this.treeNode.parent;
    this.treeNode.parent.children.splice(index + 1, 0, tmpTreeNode);
  }

  addItemsAfter(number: number) {
    const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    for (let i = 0; i < number; i++) {
      const tmpTreeNode: SkTreeNode = {label: ''};
      tmpTreeNode.parent = this.treeNode.parent;
      this.treeNode.parent.children.splice(index + i + 1, 0, tmpTreeNode);
    }

  }

  deleteItem() {
    if (this.treeNode.parent) {
      const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
      this.treeNode.parent.children.splice(index, 1);
    }
  }

  // Section
  addItemChild() {
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.parent = this.treeNode;
    this.treeNode.children.splice(0, 0, tmpTreeNode);
  }

  addSectionChild() {
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.children = [];
    tmpTreeNode.parent = this.treeNode;
    this.treeNode.children.splice(0, 0, tmpTreeNode);
  }

  addSectionBefore() {
    const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.parent = this.treeNode.parent;
    tmpTreeNode.children = [];
    this.treeNode.parent.children.splice(index, 0, tmpTreeNode);
  }

  addSectionAfter() {
    const index = this.findNodeIndexInParent(this.treeNode, this.treeNode.parent);
    const tmpTreeNode: SkTreeNode = {label: ''};
    tmpTreeNode.children = [];
    tmpTreeNode.parent = this.treeNode.parent;
    this.treeNode.parent.children.splice(index + 1, 0, tmpTreeNode);
  }


}
