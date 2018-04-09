import {Injectable} from '@angular/core';
import {SkDocData, SkItem, SkSection} from '../../model/document';

@Injectable()
export class DocumentService {

  constructor() {
  }


  // doc list view
  SkTreeListFromJSON(docJson: string): Array<SkSection | SkItem> {
    const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);
    console.log(docTree);
    const resultArry = [];
    docTree.level = 0;
    return this.makeTreeList(docTree, resultArry, docTree, 0);
  }


  makeTreeList(docTreeItem: SkSection | SkItem, resultArray, parent: SkSection, index) {
    if (docTreeItem instanceof SkSection) {
      if (docTreeItem !== parent) {
        docTreeItem.numbering = parent.numbering ? `${parent.numbering}.${index}` : index;
        docTreeItem.level = parent.level + 1;
      }
      resultArray.push(docTreeItem);
      index = 0;
      docTreeItem.nodes.forEach((item) => {
        if (item instanceof SkSection) {
          index++;
        }
        this.makeTreeList(item, resultArray, docTreeItem, index);
      });
    } else {
      docTreeItem.level = parent.level + 1;
      resultArray.push(docTreeItem);
    }
    return resultArray;
  }


  // doc task list view
  SKTasksList(docJson: string): Array<any> {
    const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);
    console.log(docTree);
    const resultArry = [];
    docTree.level = 0;
    return this.makeTaskList(docTree, resultArry, []);
  }


  makeTaskList(section: SkSection, results: Array<any>, parents: Array<SkSection> = []) {

    if (section.nodes.length === 0) {
      return;
    }
    let index = 0;
    for (let i = 0; i < section.nodes.length; i++) {
      // if section - recurse
      if (section.nodes[i] instanceof SkSection) {
        index ++;
        section.nodes[i].numbering = section.numbering ? `${section.numbering}.${index}` : `${index}`;
        section.nodes[i].level = section.level + 1;
        const temp = [...parents];
        temp.push(<SkSection>section.nodes[i]);
        this.makeTaskList(<SkSection>section.nodes[i], results, temp);
      }

      // if Item - add brothers
      // 1. make local result
      const localRes = [];
      let tempI = 0;
      while ( i + tempI < section.nodes.length && section.nodes[i + tempI] instanceof SkItem) {
        section.nodes[i + tempI].level = section.level + 1;
        localRes.push(section.nodes[i + tempI]);
        tempI++;
      }
      i = tempI > 0 ? i + tempI - 1 : i;
      if (localRes.length > 0) {results.push( {parents, docs: localRes} ); }
    }
    return results;

  }
}
