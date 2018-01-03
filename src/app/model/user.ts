import {OrgUser} from './org-user';

export class User {
  isLoadingOrgUser = true;
  isAuthenticated = false;
  currentOrgUser: OrgUser = null;
  currentSkUser;
  currentAuthUser;
}
