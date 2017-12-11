import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


admin.initializeApp(functions.config().firebase);

import * as orgFunctions from './org'

export const newOrgRequest =  orgFunctions.newOrgRequest;



