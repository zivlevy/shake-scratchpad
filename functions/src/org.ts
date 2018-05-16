import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {
  algoliaInitIndex, algoliaGetSearchKey, algoliaSaveDoc, AlgoliaDoc, algoliaOrgDelete, algoliaDeleteVersionDoc,
  algoliaDeletePublishedDoc, algoliaDeleteEditedDoc
} from "./algolia";
import {sendOrgInvite} from "./sendgrid";


const saveEditDoc = function (orgId, docId, data) {
  const editedDoc = new AlgoliaDoc;
  if ( data.editVersion !== undefined) {
    editedDoc.name = data.editVersion.name;
    editedDoc.plainText = data.editVersion.plainText;
    editedDoc.plainTextSize = data.editVersion.plainTextSize;
    editedDoc.docId = docId;
    editedDoc.docType = 'e';
    editedDoc.version = 0;
    editedDoc.objectID = docId + 'e';
    return algoliaSaveDoc(orgId, editedDoc);
  } else {
    return Promise.resolve();
  }
};

const savePublishDoc = function (orgId, docId, data) {
  const publishedDoc = new AlgoliaDoc;
  if ( data.publishVersion !== undefined) {
    publishedDoc.name = data.publishVersion.name;
    publishedDoc.plainText = data.publishVersion.plainText;
    publishedDoc.plainTextSize = data.publishVersion.plainTextSize;
    publishedDoc.docId = docId;
    publishedDoc.docType = 'p';
    publishedDoc.version = data.version;
    publishedDoc.objectID = docId + 'p';
    return algoliaSaveDoc(orgId, publishedDoc);
  } else {
    return Promise.resolve();
  }
};

const saveVersionDoc = function (orgId, docId, data) {
  const versionDoc = new AlgoliaDoc;
  versionDoc.name = data.name;
  versionDoc.plainText = data.plainText;
  versionDoc.plainTextSize = data.plainTextSize;
  versionDoc.docId = docId;
  versionDoc.docType = 'v';
  versionDoc.version = data.version;
  versionDoc.objectID = docId + data.version;
  return algoliaSaveDoc(orgId, versionDoc);
};

export const onPrivateDocUpdated = functions.firestore.document('org/{orgId}/docs/{docId}').onUpdate((data, context) => {

  const orgId = context.params.orgId;
  const docData = data.after.data();
  const docId = context.params.docId;

  // edited Version
  const saveEdit = saveEditDoc(orgId, docId, docData);

  let savePublish;
  // published Version
  if (docData.isPublish) {
    savePublish = savePublishDoc(orgId, docId, docData);
  } else {
    const publishPlainTextSize = data.before.data().publishVersion.plainTextSize ? data.before.data().publishVersion.plainTextSize : 1;
    savePublish = algoliaDeletePublishedDoc(orgId, docId, publishPlainTextSize);
  }

  return Promise.all([saveEdit, savePublish])
    .catch(err => console.log(err));
});

export const onPrivateDocCreated = functions.firestore.document('org/{orgId}/docs/{docId}').onCreate((data, context) => {

  const orgId = context.params.orgId;
  const docData = data.data();
  const docId = context.params.docId;

  // edited Version
  const saveEdit = saveEditDoc(orgId, docId, docData);

  // published Version
  const savePublish = savePublishDoc(orgId, docId, docData);

  return Promise.all([saveEdit, savePublish])
    .catch(err => console.log(err));

});

export const onPrivateDocVersionCreated = functions.firestore.document('org/{orgId}/docs/{docId}/versions/{version}').onCreate((data, context) => {

  const orgId = context.params.orgId;
  const docData = data.data();
  const docId = context.params.docId;
  return saveVersionDoc(orgId, docId, docData)
    .catch(err => console.log(err));


});

export const onPrivateDocVersionDeleted = functions.firestore.document('org/{orgId}/docs/{docId}/versions/{version}').onDelete((data, context) => {

  const orgId = context.params.orgId;
  const docId = context.params.docId;
  const version =context.params.version;
  const plainTextSize = data.data().plainTextSize ? data.data().plainTextSize : 1;

  return algoliaDeleteVersionDoc(orgId, docId, version, plainTextSize)
    .catch(err => console.log(err));
});

export const onPrivateDocDeleted = functions.firestore.document('org/{orgId}/docs/{docId}').onDelete((data, context) => {
  const orgId = context.params.orgId;
  const docId = context.params.docId;
  const editPlainTextSize = data.data().editVersion.plainTextSize ? data.data().editVersion.plainTextSize : 1;
  const publishPlainTextSize = data.data().publishVersion.plainTextSize ? data.data().publishVersion.plainTextSize : 1;

  // edited Version
  const deleteEdit = algoliaDeleteEditedDoc(orgId, docId, editPlainTextSize);

  // published Version
  const deletePublished = algoliaDeletePublishedDoc(orgId, docId, publishPlainTextSize);

  return Promise.all([deleteEdit, deletePublished])
    .catch(err => console.log(err));
});

export const newOrgRequest = functions.firestore
  .document('orgRequested/{doc}').onCreate((data, context) => {
    const newOrg = data.data();
    const db = admin.firestore();
    const orgRootRef = db.collection('org').doc(newOrg.orgId);
    const orgInfoRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
    const orgUserRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
    const usersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);

    // set the root org
    return orgRootRef.set({'searchKey': ''}, {merge: true})
      .then(() => {

        // set public info
        const setPublicInfo =  orgInfoRef.set({
          orgId: newOrg.orgId,
          orgName: newOrg.orgName,
          orgEmail: newOrg.email,
          language: newOrg.language,
          sector: newOrg.sector,
          createdBy: newOrg.createdBy
        });

        // set user info in org users
        const setUserInfo =
          orgUserRef.set({
            displayName: newOrg.displayName,
            email: newOrg.email,
            photoURL: newOrg.photoURL,
            uid: newOrg.uid,
            roles: {admin: true, editor: true, viewer: true}
          }).catch();

        // set org data in user
        const  setOrgInUserRecord = usersRef.set({
          orgName: newOrg.orgName
        }).catch();

        // init algolia Index
        const initAlgoliaIndex = algoliaInitIndex(newOrg.orgId);

        // set algolia search key
        const searchKey = algoliaGetSearchKey(newOrg.orgId);
        //
        //save search key to org data
        const setRootFields = orgRootRef.set({
          searchKey: searchKey,
          orgTreeJson: "[{\"name\":\"root\",\"children\":[],\"isDoc\":false}]"
        });

        return Promise.all([setPublicInfo, setUserInfo, setOrgInUserRecord, setRootFields, initAlgoliaIndex])
          .catch(err => console.log(err))

      })
      // delete orgRequested
      .then(() => {
        return db.collection('orgRequested').doc(newOrg.orgId).delete();
      })
      .then(() => {return 0})
      .catch(() => { return 1}
      );
});

export const onOrgDelete = functions.firestore.document('org/{orgId}').onDelete((data, context) => {
  const orgId = context.params.orgId;
  console.log(orgId);

  return algoliaOrgDelete(orgId)
    .catch(err => console.log(err));

});

export const onOrgInviteCreate = functions.firestore.document('org/{orgId}/invites/{email}').onCreate((data, context) => {
  const orgId = context.params.orgId;
  const email = context.params.email;

  const db = admin.firestore();
  const orgPublicData = db.collection('org').doc(orgId).collection('publicData').doc('info').get();
  const orgInviteData = db.collection('org').doc(orgId).collection('invites').doc(email).get();

  return Promise.all([orgPublicData, orgInviteData])
    .then(res => {
      return sendOrgInvite(orgId, res[0].data(), email, res[1].data())
    })
    .catch(err => console.log(err));
});

// ToDo - turn into transaction
export const onOrgUserDocSignCreate = functions.firestore.document(`org/{orgId}/userSignatures/{uid}`).onCreate((data, context) => {
  const uid = context.params.uid;
  const orgId = context.params.orgId;
  const docAckId = data.data().docAckId;
  const signedAt = data.data().signedAt;

  const db = admin.firestore();

  const getOrgDocAck = db.collection('org').doc(orgId).collection('docsAcks').doc(docAckId).get();

  return getOrgDocAck
    .then((docAck: any) => {
      const newActualSignatures = docAck.data().actualSignatures + 1;
      console.log(docAck);
      console.log(newActualSignatures);
      const updateOrgDocAck = db.collection('org').doc(orgId).collection('docsAcks').doc(docAckId).update({
        actualSignatures: newActualSignatures
      });
      const setOrgDocAckUser = db.collection('org').doc(orgId).collection('docsAcks').doc(docAckId).collection('users').doc(uid).update({
        hasSigned: true,
        signedAt: signedAt
      });

      const deleteOrgUserDocAck = db.collection('org').doc(orgId).collection('users').doc(uid).collection('docsAcks').doc(docAckId).delete();

      const deleteTempSignature = db.collection('org').doc(orgId).collection('userSignatures').doc(uid).delete();


      return Promise.all([updateOrgDocAck, setOrgDocAckUser, deleteOrgUserDocAck, deleteTempSignature])
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

export const onDocAckCreate = functions.firestore.document(`org/{orgId}/docsAcks/{docAckId}`).onCreate((data, context) => {
  const orgId = context.params.orgId;
  const docId = data.data().docId;
  const docAckId = context.params.docAckId;

  const db = admin.firestore();

  return db.collection('org').doc(orgId).collection('docs').doc(docId).collection('docAcks').doc(docAckId).set({});
});

export const onDocAckUserAdd = functions.firestore.document(`org/{orgId}/docsAcks/{docAckId}/users/{uid}`).onCreate((data, context) => {
  const orgId = context.params.orgId;
  const uid = context.params.uid;
  const docAckId = context.params.docAckId;

  const db = admin.firestore();

  const docAckRef = db.collection('org').doc(orgId).collection('docsAcks').doc(docAckId);
  const userDocAckRef = db.collection('org').doc(orgId).collection('users').doc(uid).collection('docsAcks').doc(docAckId);

  return db.runTransaction(transaction => {
    return transaction.get(docAckRef)
      .then(docAck => {
        const docAckName = docAck.data().name;
        const docId = docAck.data().docId;
        const requiredSignatures = docAck.data().requiredSignatures + 1;

        transaction.set(userDocAckRef, {
          docAckName: docAckName,
          docId: docId,
        });

        transaction.update(docAckRef, {
          requiredSignatures: requiredSignatures
        });
      });
  });

});

export const onDocAckUserRemove = functions.firestore.document(`org/{orgId}/docsAcks/{docAckId}/users/{uid}`).onDelete((data, context) => {
  const orgId = context.params.orgId;
  const uid = context.params.uid;
  const docAckId = context.params.docAckId;

  const db = admin.firestore();

  const docAckRef = db.collection('org').doc(orgId).collection('docsAcks').doc(docAckId);
  const userDocAckRef = db.collection('org').doc(orgId).collection('users').doc(uid).collection('docsAcks').doc(docAckId);

  return db.runTransaction(transaction => {
    return transaction.get(docAckRef)
      .then(docAck => {
        const requiredSignatures = docAck.data().requiredSignatures - 1;

        transaction.delete(userDocAckRef);

        transaction.update(docAckRef, {
          requiredSignatures: requiredSignatures
        });
      });
  });

});
