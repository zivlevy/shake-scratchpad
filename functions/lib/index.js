"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const orgFunctions = require("./org");
const usersFunctions = require("./users");
// org
exports.newOrgRequest = orgFunctions.newOrgRequest;
exports.onPrivateDocCreated = orgFunctions.onPrivateDocCreated;
// users
exports.deleteUser = usersFunctions.deleteUser;
exports.updateUserInfo = usersFunctions.updateUserInfo;
//# sourceMappingURL=index.js.map