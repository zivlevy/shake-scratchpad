"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// admin.initializeApp(functions.config().firebase);
exports.newOrgRequest = functions.firestore
    .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    console.log(newOrg);
    // Firestore database
    const db = admin.firestore();
    const orgRef = db.collection('org').doc(newOrg.orgName).collection('publicData').doc('info');
    orgRef.set({ description: 'this is description', name: newOrg.orgName })
        .then(() => {
        db.collection('orgRequested').doc(newOrg.orgName).delete()
            .catch();
    }).catch();
    return 0;
});
//# sourceMappingURL=org.js.map