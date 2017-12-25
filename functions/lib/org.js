"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const copyInitialDataPackage = function (orgRef, dataPackageRef) {
    dataPackageRef.get().then(function (doc) {
        console.log(doc.data().iconID);
        orgRef.update({ iconId: doc.data().iconID });
    });
};
exports.newOrgRequest = functions.firestore
    .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    const db = admin.firestore();
    const orgRootRef = db.collection('org').doc(newOrg.orgId);
    const orgInfoRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
    const usersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);
    const orgUserRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
    const dataPackageRef = db.collection('countries').doc(newOrg.country).collection('sectors').doc(newOrg.sector);
    // set the root org
    orgRootRef.set({}, { merge: true })
        .then(() => orgInfoRef.set({
        orgId: newOrg.orgId,
        orgName: newOrg.orgName,
        country: newOrg.country,
        sector: newOrg.sector,
        createdBy: newOrg.createdBy
    }))
        .then(() => {
        //  insert initial data package
        copyInitialDataPackage(orgInfoRef, dataPackageRef);
        // set user info in org users
        orgUserRef.set({
            displayName: newOrg.displayName,
            email: newOrg.email,
            photoURL: newOrg.photoURL,
            roles: { admin: true, editor: false, viewer: false }
        }).catch();
        // set the org in the users collection under the userID
        usersRef.set({}).catch();
    })
        .then(() => db.collection('orgRequested').doc(newOrg.orgId).delete())
        .catch();
    return 0;
});
// export const newOrgRequest = functions.firestore
//   .document('orgRequested/{doc}').onCreate((event) => {
//     const newOrg = event.data.data();
//     const db = admin.firestore();
//     const orgRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
//     const usersRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
//     const orgUsersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);
//     const dataPackageRef = db.collection('countries').doc(newOrg.country).collection('sectors').doc(newOrg.sector);
//
//     usersRef.set({userName:newOrg.userName , roles: {admin: true, editor: false, viewer: false}})
//       .catch();
//     orgRef.set({orgId: newOrg.orgId, orgName: newOrg.orgName, country: newOrg.country, sector: newOrg.sector, createdBy: newOrg.createdBy})
//       .then(() => {
//         copyInitialDataPackage(orgRef, dataPackageRef);
//         db.collection('orgRequested').doc(newOrg.orgId).delete().catch();
//         orgUsersRef.set({}).catch();
//       }).catch();
//
//     return 0;
//
//   });
//# sourceMappingURL=org.js.map