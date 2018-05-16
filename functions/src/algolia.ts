const algoliasearch = require('algoliasearch');
const functions = require('firebase-functions');

const ALGOLIA_APP_ID = functions.config().algolia.app_id;
const ALGOLIA_ADMIN_KEY = functions.config().algolia.admin_key;
const ALGOLIA_SEARCH_KEY = functions.config().algolia.search_key;

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const ALGOLIA_MAX_RECORD = 9000;

export class AlgoliaDoc {
  objectID: string;
  docId: string;
  docType: string;
  version: number;
  name: string;
  plainText: string;
  plainTextSize?: number;
}

const getNumberOfRecords = function(docSize: number) {
  return Math.floor(docSize / ALGOLIA_MAX_RECORD) + 1;
}

const getPartOfText = function(fullText: string, partNum: number) {
  const startChar = fullText.lastIndexOf(' ', (partNum - 1) * ALGOLIA_MAX_RECORD);
  const endChar = fullText.lastIndexOf(' ', partNum * ALGOLIA_MAX_RECORD);
  return fullText.slice(startChar, endChar);
}

export const algoliaSaveDoc = function (orgId, algoliaDoc) {
  const index = client.initIndex(orgId);
  const numOfRecs = getNumberOfRecords(algoliaDoc.plainTextSize);
  if (numOfRecs === 1) {
    return index.saveObject(algoliaDoc);
  } else {
    const saveArray = [];
    for (let i = 1 ; i <= numOfRecs ; i++) {
      const partDoc = new AlgoliaDoc();
      partDoc.name = algoliaDoc.name;
      partDoc.plainText = getPartOfText(algoliaDoc.plainText, i);
      partDoc.docId = algoliaDoc.docId;
      partDoc.docType = algoliaDoc.docType;
      partDoc.version = algoliaDoc.version;
      partDoc.objectID = algoliaDoc.objectID + i;
      saveArray.push(index.saveObject(partDoc));
    }
    return Promise.all(saveArray)
      .catch(err => console.log(err));
  }

};

export const algoliaDeleteVersionDoc = function(orgId, docId, version, plainTextSize) {
  const index = client.initIndex(orgId);
  const numOfRecs = getNumberOfRecords(plainTextSize);
  if (numOfRecs === 1) {
    return index.deleteObject(docId + version);
  } else {
    const deleteArray = [];
    for (let i = 1 ; i <= numOfRecs ; i++) {
      deleteArray.push(index.deleteObject(docId + version + i));
    }
    return Promise.all(deleteArray)
      .catch(err => console.log(err));
  }
};

export const algoliaDeleteEditedDoc = function(orgId, docId, plainTextSize) {
  const index = client.initIndex(orgId);
  const numOfRecs = getNumberOfRecords(plainTextSize);
  if (numOfRecs === 1) {
    return index.deleteObject(docId + 'e');
  } else {
    const deleteArray = [];
    for (let i = 1 ; i <= numOfRecs ; i++) {
      deleteArray.push(index.deleteObject(docId + 'e' + i));
    }
    return Promise.all(deleteArray)
      .catch(err => console.log(err));
  }
};

export const algoliaDeletePublishedDoc = function(orgId, docId, plainTextSize) {
  const index = client.initIndex(orgId);
  const numOfRecs = getNumberOfRecords(plainTextSize);
  if (numOfRecs === 1) {
    return index.deleteObject(docId + 'p');
  } else {
    const deleteArray = [];
    for (let i = 1 ; i <= numOfRecs ; i++) {
      deleteArray.push(index.deleteObject(docId + 'p' + i));
    }
    return Promise.all(deleteArray)
      .catch(err => console.log(err));
  }
};

export const algoliaInitIndex = function (orgId) {
  const index = client.initIndex(orgId);
  return index.setSettings({
    searchableAttributes: [
      'name', 'plainText'
    ],
    attributesForFaceting: [
      'docType', 'version'
    ],
    typoTolerance: false
  })
};

export const algoliaGetSearchKey = function (orgId) {
    return client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, {restrictIndices: orgId});
};

export const algoliaOrgDelete = function (orgId) {
  return client.deleteIndex(orgId);
};
