import {OrgUser} from './org-user';

export class User {
  isLoadingOrgUser = true;
  isAuthenticated = false;
  currentOrgUser: OrgUser = null;
  currentSkUser;
  currentAuthUser;
}

export class SkUserOrg {
  orgId: string;
  orgName?: string;
}
export class SkUser {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  isSkAdmin?: boolean;
  orgs?: Array<SkUserOrg>;
}
