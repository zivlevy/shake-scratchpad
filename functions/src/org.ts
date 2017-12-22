import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

const copyInitialDataPackage = function(orgRef, dataPackageRef) {
  dataPackageRef.get().then(function (doc) {
    console.log(doc.data().iconID);
    orgRef.update({iconId: doc.data().iconID});
  })
};

export const newOrgRequest = functions.firestore
  .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    // Firestore database
    const db = admin.firestore();
    const orgRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
    const usersRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
    const orgUsersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);
    const dataPackageRef = db.collection('countries').doc(newOrg.country).collection('sectors').doc(newOrg.sector);

    usersRef.set({userName:newOrg.userName , roles: {admin: true, editor: false, viewer: false}})
      .catch();
    orgRef.set({orgId: newOrg.orgId, orgName: newOrg.orgName, country: newOrg.country, sector: newOrg.sector, createdBy: newOrg.createdBy})
      .then(() => {
        copyInitialDataPackage(orgRef, dataPackageRef);
        db.collection('orgRequested').doc(newOrg.orgId).delete().catch();
        orgUsersRef.set({}).catch();
      }).catch();

    return 0;

  });
