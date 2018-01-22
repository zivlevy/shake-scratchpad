const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = 'OH29RANN3N';
const ALGOLIA_ADMIN_KEY = 'c782dd173961404a169945f8079361a3';
const ALGOLIA_SEARCH_KEY = '36aee713e12b4f08ee8f1ba9c4bc6360';

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

export class AlgoliaDoc {
  objectID: string;
  docId: string;
  docType: string;
  version: number;
  name: string;
  plainText: string;
}

export const algoliaSaveDoc = function (orgId, algoliaDoc) {
  const index = client.initIndex(orgId);
  return index.saveObject(algoliaDoc);
};

export const algoliaDeleteVersionDoc = function(orgId, docId, version) {
  const index = client.initIndex(orgId);
  return index.deleteObject(docId + version);
}

export const algoliaInitIndex = function (orgId) {
  const index = client.initIndex(orgId);
  return index.setSettings({
    searchableAttributes: [
      'name', 'plainText'
    ],
    attributesForFaceting: [
      'docType', 'version'
    ]
  })
};

export const algoliaGetSearchKey = function (orgId) {
    return client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, {restrictIndices: orgId});
};

export const algoliaOrgDelete = function (orgId) {
  return client.deleteIndex(orgId);
}
