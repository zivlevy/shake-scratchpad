"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.newOrgRequest = functions.firestore
    .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    const db = admin.firestore();
    const orgRef = db.collection('org').doc(newOrg.name).collection('publicData').doc('info');
    const usersRef = db.collection('org').doc(newOrg.name).collection('users').doc(newOrg.createdBy);
    const orgUsersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.name);
    usersRef.set({ displayName: newOrg.displayName, roles: { admin: true, editor: false, viewer: false } })
        .catch();
    orgRef.set({ description: 'this is description', name: newOrg.name, createdBy: newOrg.createdBy })
        .then(() => {
        db.collection('orgRequested').doc(newOrg.name).delete().catch();
        orgUsersRef.set({}).catch();
    }).catch();
    return 0;
});
//# sourceMappingURL=org.js.map