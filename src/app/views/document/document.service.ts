import {Injectable} from '@angular/core';
import {SK_ITEM_TYPE, SkItem, SkSection} from '../../model/document';
import {HttpClient} from '@angular/common/http';
import {ReplaySubject} from 'rxjs/index';

@Injectable()
export class DocumentService {

  constructor(private http: HttpClient) {
  }


  // doc list view
  SkTreeListFromJSON(docObject): Array<SkSection | SkItem> {
    // const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);
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

  getMapTreeFromDocJson(docObject) {
    // const docObject = JSON.parse(docJson);
    const docTree = new SkSection().deserialize(docObject);

    const nodes = [];
    docTree.level = 0;
    this.makeMapTree(docTree, nodes, docTree, 0);
    return nodes;
  }

  makeMapTree(docTree, nodes, parent, index) {
    if (docTree !== parent) {
      docTree.numbering = parent.numbering ? `${parent.numbering}.${index}` : index;
      docTree.level = parent.level + 1;
    }

    if (docTree.nodes) {
      const childNodes = [];
      index = 0;
      docTree.nodes.forEach(node => {
        if (node instanceof SkSection) {
          index++;
        }
        this.makeMapTree(node, childNodes, docTree, index);
      });
      nodes.push({
        numbering: docTree.numbering,
        name: this.stripHtml(docTree.data),
        children: childNodes
      });

    } else {
      return;
    }
  }

  // private stripHtml(str) {
  //   // Remove some tags
  //   str = str.replace(/<[^>]+>/gim, ' ');
  //
  //   // Remove BB code
  //   str = str.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '$2 ');
  //
  //   // Remove other staff;
  //   str = str.replace(/\&nbsp;/g, ' ');
  //   str = str.replace(/\&quot;/g, ' ');
  //   str = str.replace(/\&ndash;/g, ' ');
  //   str = str.replace(/\&#39;/g, ' ');
  //
  //   return str;
  // }

  importWordDoc(inFile) {
    const wordDoc: ReplaySubject<any> = new ReplaySubject(1);

    const fileReader = new FileReader();
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'text/plain',
    //   })
    // };

    fileReader.readAsArrayBuffer(inFile);

    fileReader.onload = () => {
       this.http.post('https://kmrom.com/ShakeService/Services/v2/ParseDocx.aspx', fileReader.result)
        .subscribe(res => {
          console.log(res);
          wordDoc.next(res) ;
        }, err => {
          wordDoc.error(err);
          console.log(err);
        });
    };

    return wordDoc;
  }

  prepareDocToSave(nodes)  {
    console.log(nodes);
    const plainText = {plainText: ''};
    const tree = this.treeNodeToSkSection(nodes[0], plainText);
    return {
      data: JSON.stringify(tree),
      plainText: plainText.plainText,
      name: this.stripHtml(nodes[0].data),
      plainTextSize: plainText.plainText.length
    };
  }


  private treeNodeToSkSection(treeNode, plainText: any): SkSection | SkItem {
    if (treeNode.nodes) {
      const section: SkSection = new SkSection();
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      section.data = treeNode.data;
      treeNode.nodes.forEach(node => {
        section.nodes.push(this.treeNodeToSkSection(node, plainText));
      });
      return section;
    } else {
      const item: SkItem = new SkItem();
      item.data = treeNode.data;
      plainText.plainText += ' ' + this.stripHtml(treeNode.data);
      item.type = treeNode.type ? treeNode.type : SK_ITEM_TYPE.SK_ITEM_TYPE_INFO;
      return item;
    }
  }

  stripHtml(str) {
    // Remove some tags
    str = str.replace(/<[^>]+>/gim, ' ');

    // Remove BB code
    str = str.replace(/\[(\w+)[^\]]*](.*?)\[\/\1]/g, '$2 ');

    // Remove other staff;
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&quot;/g, ' ');
    str = str.replace(/&ndash;/g, ' ');
    str = str.replace(/&#39;/g, ' ');

    return str;
  }
}
