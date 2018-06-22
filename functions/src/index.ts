
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


admin.initializeApp();

import * as orgFunctions from './org'
import * as usersFunctions from './skusers'
import * as serverFunctions from './server-http'

// org

export const newOrgRequest =  orgFunctions.newOrgRequest;
export const onPrivateDocCreated = orgFunctions.onPrivateDocCreated;
export const onPrivateDocUpdated = orgFunctions.onPrivateDocUpdated;
export const onPrivateDocVersionCreated = orgFunctions.onPrivateDocVersionCreated;
export const onOrgDelete = orgFunctions.onOrgDelete;
export const onPrivateDocVersionDeleted = orgFunctions.onPrivateDocVersionDeleted;
export const onPrivateDocDeleted = orgFunctions.onPrivateDocDeleted;
export const onOrgInviteCreate = orgFunctions.onOrgInviteCreate;
export const onOrgUserDocSignCreate = orgFunctions.onOrgUserDocSignCreate;
export const onDocAckUserAdd = orgFunctions.onDocAckUserAdd;
export const onDocAckUserRemove = orgFunctions.onDocAckUserRemove;
export const onDocAckCreate = orgFunctions.onDocAckCreate;
export const updateRequiredSignatures = orgFunctions.updateRequiredSignatures;

// users
export const deleteUser =  usersFunctions.deleteUser;
export const updateUserInfo =  usersFunctions.updateUserInfo;
export const userAddOrg = usersFunctions.userAddOrg;

export const bigben =  serverFunctions.bigben;


