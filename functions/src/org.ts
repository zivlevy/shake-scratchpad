import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// admin.initializeApp(functions.config().firebase);


export const newOrgRequest = functions.firestore
  .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    console.log(newOrg);

    // Firestore database
    const db = admin.firestore();
    const orgRef = db.collection('org').doc(newOrg.orgName).collection('publicData').doc('info');
    orgRef.set({description: 'this is description', name: newOrg.orgName})
      .then(() => {
        db.collection('orgRequested').doc(newOrg.orgName).delete()
          .catch();
      }).catch();

    return 0;

  });
