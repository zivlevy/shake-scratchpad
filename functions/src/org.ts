import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {algoliaInitIndexAndGetSearchKey, algoliaUploadDoc, algoliaSaveDoc, AlgoliaDoc} from "./algolia";


const copyInitialDataPackage = function (newOrg, orgInfoRef, dataPackageRef) {
  dataPackageRef.get().then(function (doc) {

    const logo = admin.storage().bucket().file('dataPackages/logos/' + doc.data().logoFileName);
    const banner = admin.storage().bucket().file('dataPackages/banners/' + doc.data().bannerFileName);

    const newLogoLocation = 'orgs/' + newOrg.orgId + '/logo';
    const newBannerLocation = 'orgs/' + newOrg.orgId + '/banner';

    logo.copy(newLogoLocation)
      .then()
      .catch();

    banner.copy(newBannerLocation)
      .then()
      .catch();

  })
};

const saveEditDoc = function (orgId, docId, data) {
  const editedDoc = new AlgoliaDoc;
  if ( data.editVersion !== undefined) {
    editedDoc.name = data.editVersion.name;
    editedDoc.plainText = data.editVersion.plainText;
    editedDoc.docId = docId;
    editedDoc.docType = 'e';
    editedDoc.version = 0;
    editedDoc.objectID = docId + 'e';
    algoliaSaveDoc(orgId, editedDoc);
  }
}

const savePublishDoc = function (orgId, docId, data) {
  const publishedDoc = new AlgoliaDoc;
  if ( data.editVersion !== undefined) {
    publishedDoc.name = data.publishVersion.name;
    publishedDoc.plainText = data.publishVersion.plainText;
    publishedDoc.docId = docId;
    publishedDoc.docType = 'p';
    publishedDoc.version = data.version;
    publishedDoc.objectID = docId + 'p';
    algoliaSaveDoc(orgId, publishedDoc);
  }
}

const saveVersionDoc = function (orgId, docId, data) {
  const versionDoc = new AlgoliaDoc;
  versionDoc.name = data.name;
  versionDoc.plainText = data.plainText;
  versionDoc.docId = docId;
  versionDoc.docType = 'v';
  versionDoc.version = data.version;
  versionDoc.objectID = docId + data.version;
  algoliaSaveDoc(orgId, versionDoc);
}
export const onPrivateDocUpdated = functions.firestore.document('org/{orgId}/docs/{docId}').onUpdate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.data.id;
  // edited Version
  saveEditDoc(orgId, docId, data);

  // published Version
  savePublishDoc(orgId, docId, data);

  return 0;
})

export const onPrivateDocCreated = functions.firestore.document('org/{orgId}/docs/{docId}').onCreate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.data.id;
  // edited Version
  saveEditDoc(orgId, docId, data);

  // published Version
  savePublishDoc(orgId, docId, data);

  return 0;
});

export const onPrivateDocVersionCreated = functions.firestore.document('org/{orgId}/docs/{docId}/versions/{version}').onCreate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.resource.match("docs/(.*)/versions")[1];
  saveVersionDoc(orgId, docId, data);

  return 0;
});

export const newOrgRequest = functions.firestore
  .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    const db = admin.firestore();
    const orgRootRef = db.collection('org').doc(newOrg.orgId);
    const orgInfoRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
    const usersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);
    const orgUserRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
    const dataPackageRef = db.collection('dataPackages').doc(newOrg.language).collection('sectors').doc(newOrg.sector);

    // set the root org
    orgRootRef.set({'searchKey': ''}, {merge: true})
      .then(() => {
        orgInfoRef.set({    // then - insert public info
          orgId: newOrg.orgId,
          orgName: newOrg.orgName,
          language: newOrg.language,
          sector: newOrg.sector,
          createdBy: newOrg.createdBy
        });

        copyInitialDataPackage(newOrg, orgInfoRef, dataPackageRef);

        const searchKey = algoliaInitIndexAndGetSearchKey(newOrg.orgId);
        orgRootRef.set({
          searchKey: searchKey
        });
      })
      .then(() => {
        //  insert initial data package
        // copyInitialDataPackage(newOrg, orgInfoRef, dataPackageRef);

        // get org public search key
        // const searchKey = algoliaInitIndexAndGetSearchKey(newOrg.orgId);
        // orgRootRef.set({
        //   searchKey: searchKey
        // });

        // set user info in org users
        orgUserRef.set({
          displayName: newOrg.displayName,
          email: newOrg.email,
          photoURL: newOrg.photoURL,
          uid:newOrg.uid,
          roles: {admin: true, editor: false, viewer: false}}).catch();

        // set the org in the users collection under the userID
        usersRef.set({}).catch();
      })
      // delete orgRequested
      .then(() => db.collection('orgRequested').doc(newOrg.orgId).delete())
      .catch();

    return 0;

  });



