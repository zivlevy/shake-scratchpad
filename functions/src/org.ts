import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {algoliaInitIndex, algoliaGetSearchKey, algoliaSaveDoc, AlgoliaDoc} from "./algolia";
// admin.initializeApp(functions.config().firebase);

const copyInitialDataPackage = function (newOrg, orgInfoRef, dataPackageRef) {
  return dataPackageRef.get().then (doc =>  {

    const logo = admin.storage().bucket().file('dataPackages/logos/' + doc.data().logoFileName);
    const banner = admin.storage().bucket().file('dataPackages/banners/' + doc.data().bannerFileName);

    const newLogoLocation = 'orgs/' + newOrg.orgId + '/logo';
    const newBannerLocation = 'orgs/' + newOrg.orgId + '/banner';

    const logoP =  logo.copy(newLogoLocation);
    const bannerP = banner.copy(newBannerLocation)
    return Promise.all([logoP, bannerP])
      .catch( )
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
    return algoliaSaveDoc(orgId, editedDoc);
  } else {
    return Promise.resolve();
  }
}

const savePublishDoc = function (orgId, docId, data) {
  const publishedDoc = new AlgoliaDoc;
  if ( data.publishVersion !== undefined) {
    publishedDoc.name = data.publishVersion.name;
    publishedDoc.plainText = data.publishVersion.plainText;
    publishedDoc.docId = docId;
    publishedDoc.docType = 'p';
    publishedDoc.version = data.version;
    publishedDoc.objectID = docId + 'p';
    return algoliaSaveDoc(orgId, publishedDoc);
  } else {
    return Promise.resolve();
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
  return algoliaSaveDoc(orgId, versionDoc);
}
export const onPrivateDocUpdated = functions.firestore.document('org/{orgId}/docs/{docId}').onUpdate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.data.id;

  // edited Version
  const saveEdit = saveEditDoc(orgId, docId, data);

  // published Version
  const savePublish = savePublishDoc(orgId, docId, data);

  return Promise.all([saveEdit, savePublish])
    .catch(err => console.log(err));
})

export const onPrivateDocCreated = functions.firestore.document('org/{orgId}/docs/{docId}').onCreate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.data.id;

  // edited Version
  const saveEdit = saveEditDoc(orgId, docId, data);

  // published Version
  const savePublish = savePublishDoc(orgId, docId, data);

  return Promise.all([saveEdit, savePublish])
    .catch(err => console.log(err));

});

export const onPrivateDocVersionCreated = functions.firestore.document('org/{orgId}/docs/{docId}/versions/{version}').onCreate((event) => {

  const orgId = event.resource.match("org/(.*)/docs")[1];
  const data = event.data.data();
  const docId = event.resource.match("docs/(.*)/versions")[1];
  return saveVersionDoc(orgId, docId, data)
    .catch(err => console.log(err));


});

export const newOrgRequest = functions.firestore
  .document('orgRequested/{doc}').onCreate((event) => {
    const newOrg = event.data.data();
    const db = admin.firestore();
    const orgRootRef = db.collection('org').doc(newOrg.orgId);
    const orgInfoRef = db.collection('org').doc(newOrg.orgId).collection('publicData').doc('info');
    const orgUserRef = db.collection('org').doc(newOrg.orgId).collection('users').doc(newOrg.createdBy);
    const usersRef = db.collection('users').doc(newOrg.createdBy).collection('orgs').doc(newOrg.orgId);
    const dataPackageRef = db.collection('dataPackages').doc(newOrg.language).collection('sectors').doc(newOrg.sector);

    // set the root org
    return orgRootRef.set({'searchKey': ''}, {merge: true})
      .then(() => {

        // set public info
        const setPublicInfo =  orgInfoRef.set({
          orgId: newOrg.orgId,
          orgName: newOrg.orgName,
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
            roles: {admin: true, editor: false, viewer: false}
          }).catch();

        // set org data in user
        const  setOrgInUserRecord = usersRef.set({}).catch();

        // copy logo and banner package
        const  copyImages = copyInitialDataPackage(newOrg, orgInfoRef, dataPackageRef);

        // init algolia Index
        const initAlgoliaIndex = algoliaInitIndex(newOrg.orgId);

        // set algolia search key
        const searchKey = algoliaGetSearchKey(newOrg.orgId);
        //
        //save search key to org data
        const setAlgoliaSearcKey = orgRootRef.set({
          searchKey: searchKey
        });

        return Promise.all([setPublicInfo, setUserInfo, setOrgInUserRecord, copyImages, setAlgoliaSearcKey, initAlgoliaIndex])
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


