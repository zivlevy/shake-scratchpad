"use strict";
// import * as functions from 'firebase-functions'
// import * as admin from 'firebase-admin'
//
//
// admin.initializeApp(functions.config().firebase);
Object.defineProperty(exports, "__esModule", { value: true });
const orgFunctions = require("./org");
const usersFunctions = require("./users");
// org
exports.newOrgRequest = orgFunctions.newOrgRequest;
exports.onPrivateDocCreated = orgFunctions.onPrivateDocCreated;
exports.onPrivateDocUpdated = orgFunctions.onPrivateDocUpdated;
exports.onPrivateDocVersionCreated = orgFunctions.onPrivateDocVersionCreated;
// users
exports.deleteUser = usersFunctions.deleteUser;
exports.updateUserInfo = usersFunctions.updateUserInfo;
//# sourceMappingURL=index.js.map