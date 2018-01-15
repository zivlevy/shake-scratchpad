export interface OrgTreeNode {
  id?: string;
  name?: string;
  isDoc?: boolean;
  docId?: string;
  children?: Array<OrgTreeNode> ;
}
