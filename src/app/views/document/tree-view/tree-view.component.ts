import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import * as _ from 'lodash';
import {SkTreeNode} from "../../../model/document";
@Component({
  selector: 'sk-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {
  static currentDragedObject;

  @Input() treeNode: SkTreeNode;
  @Input() identMargin: number;
  @Output() treeChange: EventEmitter<null> = new EventEmitter();
  isHoverSeperator: boolean;
  isHoverSection: boolean;
  constructor() {
  }

  ngOnInit() {

  }
  treeChanged(){
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
    console.log(ev);
    const temp = _.cloneDeep(node);
    delete temp.parent;
    console.log(temp);
    const t = JSON.stringify(temp);
    console.log(t);
    ev.dataTransfer.setData('skItem', t);
    ev.dataTransfer.dropEffect = 'move';
    ev.dataTransfer.setDragImage(ev.target, 20, 0);
    TreeViewComponent.currentDragedObject = this.treeNode;
  }

  dragEndItem(ev) {
    ev.stopPropagation();
    if (ev.dataTransfer.dropEffect !== 'none') {
      this.treeNode.parent.children.forEach((item, index , array)  => {
        if (item === TreeViewComponent.currentDragedObject) {
          array.splice(index , 1);
        }
      });
      this.treeChanged();
    }
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
    ev.dataTransfer.setDragImage(ev.target, 20, 0);
    TreeViewComponent.currentDragedObject = this.treeNode;
  }

  dragEndSection(ev) {
    ev.stopPropagation();
    if (ev.dataTransfer.dropEffect !== 'none') {
      this.treeNode.parent.children.forEach((item, index , array)  => {
        if (item === TreeViewComponent.currentDragedObject) {
          array.splice(index , 1);
        }
      });
      this.treeChanged();
    }
  }

  onDragEnterSection(ev) {
    ev.preventDefault();

  }

  onDragOverSection(ev) {
    ev.preventDefault();
    if (this.findParentExists(this.treeNode)) {
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
    const insertIndex = this.findNodeIndexInParent( this.treeNode , this.treeNode.parent);
    this.addParents(tmpTreeNode);
    this.treeNode.parent.children.splice( insertIndex, 0, tmpTreeNode);

  }

  onDragOverSeperator(ev) {
    console.log('drag Over seperator');
    ev.preventDefault();
    if (this.findParentExists(this.treeNode)) {
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
    return this.findNodeInTree( TreeViewComponent.currentDragedObject, treeNode);
  }

  findNodeIndexInParent (node: SkTreeNode, parent: SkTreeNode) : number {

    let nodeIndex: number = -1;
    parent.children.forEach( (child, index) => {
      console.log(child)
      if (child === node) nodeIndex =  index;
    })
    return nodeIndex;
  }
  findNodeInTree (treeNode: SkTreeNode, node: SkTreeNode): boolean {
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
}
