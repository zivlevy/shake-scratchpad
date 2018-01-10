import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {OrgService} from '../../organization/org.service';
import {SK_ITEM_TYPE, SkDocData, SkItem, SkSection, SkTreeNode} from '../../../model/document';

@Component({
  selector: 'sk-doc-editor',
  templateUrl: './doc-editor.component.html',
  styleUrls: ['./doc-editor.component.scss']
})
export class DocEditorComponent implements OnInit, OnChanges {

  @Input() docData: SkDocData;


  treeRoot: SkSection;
  skTree: SkTreeNode[] = [];

  constructor(private orgService: OrgService) {

  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.docData) {
      console.log(JSON.parse(this.docData.data));
      this.treeRoot = new SkSection('').deserialize(JSON.parse(this.docData.data));
      console.log(this.treeRoot);
      this.buildTree(this.treeRoot);
    }
  }

  /*****************
   * Tree
   *****************/
  private makeTree = (sk: SkSection | SkItem, parent: SkTreeNode | null): SkTreeNode => {
    if (sk instanceof SkSection) {
      return this.SkSectionToTreeNode(sk, parent);

    } else if (sk instanceof SkItem) {
      return this.SkItemToTreeNode(sk, parent);
    }
  }

  private SkSectionToTreeNode(item: SkSection, parent: SkTreeNode | null): SkTreeNode {
    const tn: SkTreeNode = {};
    tn.isRoot = !parent;
    tn.children = [];
    tn.level = parent ? parent.level + 1 : 0;
    item.nodes.forEach(node => {
      if (node instanceof SkSection) {
        tn.children.push(this.makeTree(node, tn));
      } else {
        tn.children.push(this.SkItemToTreeNode(node, tn));
      }
    });
    tn.parent = parent;
    tn.data = item.data;
    tn.expandedIcon = 'fa-folder-open';
    tn.collapsedIcon = 'fa-folder';
    tn.draggable = true;
    tn.droppable = true;
    tn.expanded = true;

    tn.leaf = item.nodes.length === 0;
    return tn;
  }

  private SkItemToTreeNode(item: SkItem, parent: SkTreeNode): SkTreeNode {
    const tn: SkTreeNode = {
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

  private itemIconByType(type: SK_ITEM_TYPE): string {
    switch (type) {
      case SK_ITEM_TYPE.SK_ITEM_TYPE_WARNING:
        return 'fa-key';
      case SK_ITEM_TYPE.SK_ITEM_TYPE_INFO:
        return 'fa-info-circle';
      case SK_ITEM_TYPE.SK_ITEM_TYPE_ACTION:
        return 'fa-file-image-o';

    }
  }

  private buildTree(section: SkSection) {
    this.skTree = [];
    this.skTree.push(this.makeTree(section, null));
  }

  /*****************
   * Temp Document
   *****************/
  private makeTempDoc = (sk: SkTreeNode): { data: string, plainText: string } => {
    const plainText = {plainText: ''};
    const tree = this.treeNodeToSkSection(this.skTree[0], plainText);
    console.log(plainText);
    console.log(tree);
    return {data: JSON.stringify(tree), plainText: plainText.plainText};
  }

  private treeNodeToSkSection(treeNode: SkTreeNode, plainText: any): SkSection | SkItem {
    if (treeNode.children) {
      const section: SkSection = new SkSection();
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      section.data = treeNode.data;
      treeNode.children.forEach(node => {
        section.nodes.push(this.treeNodeToSkSection(node, plainText));
      });
      return section;
    } else {
      const item: SkItem = new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO);
      item.data = treeNode.data;
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      item.type = treeNode.type;
      return item;
    }
  }

  private stripHtml(str) {
    // Remove some tags
    str = str.replace(/<[^>]+>/gim, '');

    // Remove BB code
    str = str.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '$2 ');

    // Remove &nbsp;
    str = str.replace(/\&nbsp;/g, '');

    return str;
  }

  reset() {
    this.skTree = [];
  }

  /******************
   *  API
   *****************/
  newDoc() {
    this.treeRoot = new SkSection('מסמך חדש');
    this.buildTree(this.treeRoot);
  }

  getDoc() {
    // create saved representation of doc
    const docToSave = this.makeTempDoc(this.skTree[0]);

    // add doc name from root node
    docToSave['name'] = this.stripHtml(this.skTree[0].data);

    return docToSave;

  }

}
