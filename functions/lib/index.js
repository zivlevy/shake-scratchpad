"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
//
//
admin.initializeApp(functions.config().firebase);
const orgFunctions = require("./org");
const usersFunctions = require("./users");
const serverFunctions = require("./server-http");
// org
exports.newOrgRequest = orgFunctions.newOrgRequest;
exports.onPrivateDocCreated = orgFunctions.onPrivateDocCreated;
exports.onPrivateDocUpdated = orgFunctions.onPrivateDocUpdated;
exports.onPrivateDocVersionCreated = orgFunctions.onPrivateDocVersionCreated;
// users
exports.deleteUser = usersFunctions.deleteUser;
exports.updateUserInfo = usersFunctions.updateUserInfo;
exports.bigben = serverFunctions.bigben;
//# sourceMappingURL=index.js.map