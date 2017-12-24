"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const orgFunctions = require("./org");
exports.newOrgRequest = orgFunctions.newOrgRequest;
//# sourceMappingURL=index.js.map