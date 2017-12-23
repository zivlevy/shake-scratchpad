"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const orgFunctions = require("./org");
const usersFunctions = require("./users");
// org
exports.newOrgRequest = orgFunctions.newOrgRequest;
// users
exports.deleteUser = usersFunctions.deleteUser;
//# sourceMappingURL=index.js.map