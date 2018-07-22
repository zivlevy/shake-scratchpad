export interface OrgRoles {
  admin?: boolean;
  editor?: boolean;
  viewer?: boolean;
}

export interface OrgUser {
    uid: string;
    email?: string;
    isPending?: boolean;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    photoURL?: string;
    roles?: OrgRoles;
    dateJoined: string;
}

