"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.newOrgRequest = functions.firestore
    .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    console.log(newOrg);
    console.log('======');
    // Firestore database
    const db = admin.firestore();
    const orgRef = db.collection('org').doc(newOrg.name).collection('publicData').doc('info');
    orgRef.set({ description: 'this is description', name: newOrg.name, createdBy: newOrg.createdBy })
        .then(() => {
        db.collection('orgRequested').doc(newOrg.name).delete()
            .catch();
    }).catch();
    return 0;
});
//# sourceMappingURL=org.js.map