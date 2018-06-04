export interface OrgTreeNode {
  id?: string;
  name?: string;
  isDoc?: boolean;
  docId?: string; // in docs this is the same as id
  isPublish?: boolean;
  isEditDirty?: boolean;
  children?: Array<OrgTreeNode> ;
}
