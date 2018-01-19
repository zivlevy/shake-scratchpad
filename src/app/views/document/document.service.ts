import { Injectable } from '@angular/core';
import {SkDocData, SkItem, SkSection} from '../../model/document';

@Injectable()
export class DocumentService {

  constructor() { }


  SkTreeListFronJSON(docJson: string): Array <SkSection | SkItem> {
    const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);
    console.log(docTree);
    const resultArry = [];
    return this.makeTreeList(docTree, resultArry, docTree, 0);
  }


  makeTreeList(docTreeItem: SkSection | SkItem, resultArray, parent: SkSection, index) {
    if (docTreeItem instanceof SkSection) {
      if (docTreeItem !== parent) {
        docTreeItem.numbering = parent.numbering ?  `${parent.numbering}.${index}` : index;
      }
      resultArray.push(docTreeItem);
      index = 0;
      docTreeItem.nodes.forEach((item) => {
        if (item instanceof SkSection) {
          index ++;
        }
        this.makeTreeList(item, resultArray, docTreeItem, index);
      });
    } else {
      resultArray.push(docTreeItem);
    }
    return resultArray;
  }
}
