interface Serializable<T> {
  deserialize(input: Object): T;
}

export enum SK_ITEM_TYPE {
  SK_ITEM_TYPE_INFO,
  SK_ITEM_TYPE_WARNING,
  SK_ITEM_TYPE_ACTION
}



export class SkSection implements Serializable<SkSection> {
  nodes: Array<SkSection | SkItem> = [];
  data: string;
  constructor (public title: string) {

  }

  deserialize(input): SkSection {
    this.title = input.title;
    this.data = input.title;
    input.nodes.forEach(node => {
      if (node.title) {
        const section: SkSection = new SkSection(node.title).deserialize(node);
        this.nodes.push (section);
      } else {
        const item: SkItem = new SkItem(node.type, node.data).deserialize(node);
        this.nodes.push (item);
      }
    });
    return this;
  }
}

export class SkItem implements Serializable<SkItem>  {

  constructor (public type: SK_ITEM_TYPE, public data: string = '', public plainText: string = '') {
  }
  deserialize(input): SkItem {
    this.type = input.type;
    this.data = input.data;
    this.plainText = input.plainText;
    return this;

  }
}


/****************
 * skTree
 *
 ***************/
export interface SkTreeNode {
  label?: string;
  data?: any;
  icon?: any;
  expandedIcon?: any;
  collapsedIcon?: any;
  children?: SkTreeNode[];
  leaf?: boolean;
  expanded?: boolean;
  type?: SK_ITEM_TYPE;
  parent?: SkTreeNode;
  partialSelected?: boolean;
  styleClass?: string;
  draggable?: boolean;
  droppable?: boolean;
  selectable?: boolean;
  level?: number;
  plainText?: string;
}
