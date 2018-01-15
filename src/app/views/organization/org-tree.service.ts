import {Injectable} from '@angular/core';
import {FirestoreService} from '../../core/firestore.service';
import {OrgService} from './org.service';
import {OrgTreeNode} from '../../model/org-tree';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class OrgTreeService {
  currentOrgId: string;

  constructor(private fs: FirestoreService,
              private orgService: OrgService) {
    this.orgService.getCurrentOrg$()
      .subscribe((orgId => this.currentOrgId = orgId));
  }

  getOrgTreeFromJson$() {
    return this.fs.doc$(`org/${this.currentOrgId}`)
      .map((result: any) => {
        return JSON.parse(result.orgTreeJson);
      });
  }

  saveOrgTree (orgTreeJson: string) {
    this.fs.update(`org/${this.currentOrgId}`, {orgTreeJson});
  }

  getOrgTree$() {
    return this.fs.colWithIds$(`org/${this.currentOrgId}/treenodes`, ref => ref.orderBy('index'));
  }


  addTreeNode(treeNode: OrgTreeNode) {
    this.fs.upsert(`org/${this.currentOrgId}/treenodes/${treeNode.id}`, treeNode);
  }


  // build full tree
  getTree$ () {
    return this.getOrgTree$()
      .switchMap( treeNodes => {
        const roots: Array<any> = treeNodes.filter( item => item.parent === '0');
        if (roots.length > 0 ) {
          this.buildSubTree(treeNodes, roots[0] );
          return Observable.of(roots);
        } else {
          return Observable.of([]);
        }
      });
  }

  buildSubTree( treeNodes, parent) {
    const allChilds = treeNodes.filter( item => item.parent === parent.id);
    allChilds.forEach( child => {
      if (!parent.children) { parent['children'] = []; }
      parent.children.push(child);
      this.buildSubTree(treeNodes, child);
    });
  }
}
