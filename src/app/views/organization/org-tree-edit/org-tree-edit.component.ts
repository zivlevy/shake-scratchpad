import {Component, OnInit, ViewChild} from '@angular/core';
import {ITreeOptions} from 'angular-tree-component';

@Component({
  selector: 'sk-org-tree-edit',
  templateUrl: './org-tree-edit.component.html',
  styleUrls: ['./org-tree-edit.component.scss']
})
export class OrgTreeEditComponent implements OnInit {
  @ViewChild('tree') tree;

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' , type: 'doc'},
        { id: 3, name: 'child2' }
      ],
    },
    {
      id: 4,
      name: 'root2',
      children: [
        { id: 5, name: 'child2.1' },
        {
          id: 6,
          name: 'child2.2',
          children: [
            { id: 7, name: 'subsub' }
          ]
        }
      ]
    }
  ];
  tree_options: ITreeOptions;
  constructor() { }

  ngOnInit() {
  }

  /******************
   *  Tree Operations
   *****************/

  private addChildItem(node) {
    if (!node.type) {
      node.data.nodes.push({name: '', children: []});
      this.tree.treeModel.update();
      this.tree.treeModel.focusDrillDown();
    }
  }

  private addBrotherItem( node, above?: boolean) {

    const indexInsert = above ? node.index : node.index + 1;

    node.parent.data.nodes.splice(indexInsert, 0, {name: '', children: []});

    setTimeout(() => this.tree.treeModel.update());

  }

  private deleteItem(node) {
    node.parent.data.nodes.splice(node.index, 1);
    this.tree.treeModel.update();
  }
}
