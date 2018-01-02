import { Component, OnInit } from '@angular/core';
import {SK_ITEM_TYPE, SkItem, SkSection, SkTreeNode} from "../../../model/document";

@Component({
  selector: 'sk-test-tree',
  templateUrl: './test-tree.component.html',
  styleUrls: ['./test-tree.component.scss']
})
export class TestTreeComponent implements OnInit {
  document: SkSection = new SkSection('myDoc');
  editedDocument: SkSection;
  treeList: Array<{ index: number, sk: SkSection | SkItem }> = [];
  ziv: SkSection;
  selectedNode: SkTreeNode = {};
  skTree: SkTreeNode[] = [];

  constructor() {

    // create document
    this.createDocument();
    // this.data.forEach(this.makeDoc);
    // console.log(this.original);
    // this.data.reduce( this.reducePath);
  }

  // create demo document
  createDocument() {
    const modules = new SkSection('Modules');
    const item1 = new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO);
    item1.data = 'Angular apps are modular and Angular has its own modularity system called NgModules.\n' +
      '\n' +
      'NgModules are a big deal. This page introduces modules; the NgModules page covers them in depth.';

    const item2 = new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING);
    item2.data = 'Decorators are functions that modify JavaScript classes. Angular has many decorators that attach metadata to classes so that it knows what those classes mean and how they should work. Learn more about decorators on the web.';
    modules.nodes.push(item1, item2);

    const angularLibs = new SkSection('Angular libraries');
    angularLibs.nodes.push(
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'Angular ships as a collection of JavaScript modules. You can think of them as library modules.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING, 'Each Angular library name begins with the @angular prefix.')
    );

    const emptySection = new SkSection('empty section');

    this.document.nodes.push(modules, emptySection, angularLibs);
    console.log(this.document);
    console.log(JSON.stringify(this.document));
    this.ziv = new SkSection('').deserialize(JSON.parse(JSON.stringify(this.document)));
  }

  ngOnInit() {
    this.makeList(this.document);
    this.buildTree(this.document);
    console.log(this.treeList);
    console.log(this.skTree);


  }

  makeList = (sk: SkSection | SkItem, index: number = 0) => {
    if (sk instanceof SkSection) {
      this.treeList.push({index, sk});
      if (sk.nodes.length > 0) {
        sk.nodes.forEach(node => {
          this.makeList(node, index + 1);
        });
      }
    } else if (sk instanceof SkItem) {

      this.treeList.push({index, sk});
    }
  }


  /*****************
   * Tree
   *****************/
  makeTree = (sk: SkSection | SkItem, parent: SkTreeNode | null): SkTreeNode => {
    if (sk instanceof SkSection) {
      return this.SkSectionToTreeNode(sk, parent);

    } else if (sk instanceof SkItem) {
      return this.SkItemToTreeNode(sk, parent);
    }
  }

  SkSectionToTreeNode(item: SkSection, parent: SkTreeNode | null): SkTreeNode {
    const tn: SkTreeNode = {};
    console.log(parent);
    tn.children = [];
    tn.level = parent ? parent.level + 1 : 0;
    item.nodes.forEach(node => {
      if (node instanceof SkSection) {
        tn.children.push(this.makeTree(node, tn));
      }
      else {
        tn.children.push(this.SkItemToTreeNode(node, tn));
      }
    });
    tn.label = item.title;
    tn.parent = parent;
    tn.data = item.title;
    tn.expandedIcon = 'fa-folder-open';
    tn.collapsedIcon = 'fa-folder';
    tn.draggable = true;
    tn.droppable = true;
    tn.expanded = true;

    tn.leaf = item.nodes.length === 0;
    return tn;
  }

  SkItemToTreeNode(item: SkItem, parent: SkTreeNode): SkTreeNode {
    const tn: SkTreeNode = {
      label: item.data,
      data: item.data,
      type: item.type,
      parent: parent,
      level: parent.level ? parent.level + 1 : 0,
      icon: this.itemIconByType(item.type),
      droppable: false,
      leaf: true,
    };
    return tn;
  }

  itemIconByType(type: SK_ITEM_TYPE): string {
    switch (type) {
      case SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING:
        return 'fa-key';
      case SK_ITEM_TYPE.SK_ITEM_TYPE_INFO:
        return 'fa-info-circle';
      case SK_ITEM_TYPE.SK_ITEM_TYPE_ACTION:
        return 'fa-file-image-o';

    }
  }

  buildTree(section: SkSection) {
    this.skTree = [];
    this.skTree.push(this.makeTree(section, null));
  }

  treeChanged() {
    console.log('===================');
    console.log(this.skTree);
    this.editedDocument = this.makeTempDoc(this.skTree[0]);
    this.buildTree(this.editedDocument);
  }

  /*****************
   * Temp Document
   *****************/
  makeTempDoc = (sk: SkTreeNode): SkSection => {
    const tree = this.treeNodeToSkSection(this.skTree[0]);
    return <SkSection>tree;
  }

  treeNodeToSkSection(treeNode: SkTreeNode): SkSection | SkItem {
    if (treeNode.children) {
      const section: SkSection = new SkSection('');
      section.title = treeNode.label;
      section.data = treeNode.data;
      section.data = treeNode.data;
      treeNode.children.forEach(tn => {
        section.nodes.push(this.treeNodeToSkSection(tn));
      });
      return section;
    } else {
      const item: SkItem = new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, '');
      item.data = treeNode.label;
      item.plainText = treeNode.plainText;
      item.type = treeNode.type;
      return item;
    }
  }

}
