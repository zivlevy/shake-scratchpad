import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


admin.initializeApp(functions.config().firebase);

import * as orgFunctions from './org'
import * as usersFunctions from './users'

// org

export const newOrgRequest =  orgFunctions.newOrgRequest;
export const onPrivateDocCreated = orgFunctions.onPrivateDocCreated;

// users
export const deleteUser =  usersFunctions.deleteUser;
export const updateUserInfo =  usersFunctions.updateUserInfo;



