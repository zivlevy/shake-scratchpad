interface Serializable<T> {
  deserialize(input: Object): T;
}


export class SkDoc {
  uid?: string ;
  name?: string = '';
  language?: string ;
  data?: string; // the formated text
  plainText?: string;


}



export enum SK_ITEM_TYPE {
  SK_ITEM_TYPE_INFO,
  SK_ITEM_TYPE_WARNING,
  SK_ITEM_TYPE_ACTION
}



export class SkSection implements Serializable<SkSection> {
  nodes: Array<SkSection | SkItem> = [];
  data: string;
  constructor (data?: string) {
    if (data) { this.data = data; }
  }

  deserialize(input): SkSection {
    this.data = input.data;
    input.nodes.forEach(node => {
      if (node.children) {
        const section: SkSection = new SkSection().deserialize(node);
        this.nodes.push (section);
      } else {
        const item: SkItem = new SkItem(node.type).deserialize(node);
        this.nodes.push (item);
      }
    });
    return this;
  }
}

export class SkItem implements Serializable<SkItem>  {
  data: string = '';
  constructor (public type: SK_ITEM_TYPE, data?: string) {
    if (data) { this.data = data; }
  }
  deserialize(input): SkItem {
    this.type = input.type;
    this.data = input.data;
    return this;
  }
}


/****************
 * skTree
 *
 ***************/
export interface SkTreeNode {
  isRoot?: boolean;
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

}
