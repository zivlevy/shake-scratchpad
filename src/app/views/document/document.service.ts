import { Injectable } from '@angular/core';
import { SkItem, SkSection} from '../../model/document';

@Injectable()
export class DocumentService {

  constructor() { }


  SkTreeListFronJSON(docJson: string): Array <SkSection | SkItem> {
    const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);
    console.log(docTree);
    const resultArry = [];
    return this.makeTreeList(docTree, resultArry);
  }


  makeTreeList(docTreeItem: SkSection | SkItem, resultArray) {
    if (docTreeItem instanceof SkSection) {
      resultArray.push(docTreeItem);
      docTreeItem.nodes.forEach(item => {
        this.makeTreeList(item, resultArray);
      });
    } else {
      resultArray.push(docTreeItem);
    }
    return resultArray;
  }
}
