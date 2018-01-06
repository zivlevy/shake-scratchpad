import { Component, OnInit } from '@angular/core';
import {SK_ITEM_TYPE, SkItem, SkSection, SkTreeNode} from '../../../model/document';

@Component({
  selector: 'sk-test-tree',
  templateUrl: './test-tree.component.html',
  styleUrls: ['./test-tree.component.scss']
})
export class TestTreeComponent implements OnInit {
  document: SkSection = new SkSection('קליטה ראשונית של מטופל סיעודי');
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
    const modules = new SkSection('אוריינטציה למטופל ולמשפחתו');
    const item1 = new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO);
    item1.data = 'עם קליטת המטופל לבית חולים גריאטרי האחות הקולטת תציג עצמה לפני החולה ומשפחתו ותיתן הסבר כללי על אופי בית החולים הגריאטרי.';
    modules.nodes.push(item1);


    const a = new SkSection('שיחה עם המטופל ומשפחתו');
    a.nodes.push(
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'האחות תקיים שיחת היכרות עם החולה ומשפחתו תתאם ציפיות ותאסוף מידע שיסייע בהשלמת האנמנזה הסיעודית כולל ההחלטה לגבי יצירת קשר והעברת מידע לאיש קשר ו/או מטפל עיקרי.'),
    );

    const b = new SkSection('שיבוץ מיקום פיזי למטופל');
    b.nodes.push(
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'על פי המידע שנאסף בשיתוף עם חברי הצוות הרב מקצועי, תשבץ האחות את המטופל לחדר מתאים ותקבע עבורו את המקום בישיבה שלו בחדר האוכל. (ראי/ה גם נוהל רוחב 0.4.5)'),
    );

    const c = new SkSection(' אומדן סיעודי ואנמנזה סיעודית');
    c.nodes.push(
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'יתבצעו מייד עם קבלתו של המטופל בבית החולים הגריאטרי ויכללו את הפעולות הבאות:'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'איסוף נתונים אישיים ודמוגראפיים.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'לקיחת סימנים חיוניים כולל שקילת המטופל.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'סקירת היסטוריה בריאותית- רפואית.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'בדיקת התרופות שהמטופל מקבל'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'אומדן גופני – תפקודי של המטופל.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'אומדן קוגניטיבי של המטופל'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'אומדן נפשי של מטופל'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'אומדן כאב למטופל'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'איסוף נתונים משפחתיים וחברתיים'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'קבלת מידע על הרגלים קודמים והעדפות של החולה ומשפחתו'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'זיהוי אבחנות סיעודיות על ידי האחות הקולטת'),
    );
    const d = new SkSection(' תוכנית טיפול סיעודית ראשונית ותיעוד');
    d.nodes.push(
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'האחות תערוך תוכנית טיפול סיעודית ראשונית על בסיס המידע שהתקבל.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'האחות תתעד ותרשום את כל התהליך ואת הנתונים שנאספו ברשומות המתאימות. ראה נוהל מס\' 2.3.1 רישום תיעוד ודווח סיעודי.'),
      new SkItem(SK_ITEM_TYPE.SK_ITEM_TYPE_INFO, 'האחות תתעד במסגרת המעקב הסיעודי השוטף, את נתוני הסתגלות המטופל'),
    );

    this.document.nodes.push(modules, a, b , c , d);

    this.ziv = new SkSection('').deserialize(JSON.parse(JSON.stringify(this.document)));
  }

  ngOnInit() {
    // this.makeList(this.document);
    this.buildTree(this.document);
    console.log(this.treeList);
    console.log(this.skTree);


  }

  // makeList = (sk: SkSection | SkItem, index: number = 0) => {
  //   if (sk instanceof SkSection) {
  //     this.treeList.push({index, sk});
  //     if (sk.nodes.length > 0) {
  //       sk.nodes.forEach(node => {
  //         this.makeList(node, index + 1);
  //       });
  //     }
  //   } else if (sk instanceof SkItem) {
  //
  //     this.treeList.push({index, sk});
  //   }
  // }


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
    tn.isRoot = !parent;
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
