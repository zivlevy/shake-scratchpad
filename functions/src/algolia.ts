const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = 'OH29RANN3N';
const ALGOLIA_ADMIN_KEY = 'f1f950108fd8021579f04e68fc73e9e2';
const ALGOLIA_SEARCH_KEY = 'ce92e39e78c39981be8c2946500374b4';

const client= algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

export class AlgoliaDoc {
  objectID: string;
  docId: string;
  docType: string;
  version: number;
  name: string;
  plainText: string;
}



export const algoliaUploadDoc = function(orgId, data) {
  const index = client.initIndex(orgId );

  index.addObject(data)
    .then()
    .catch((err) => console.log(err));
}

export const algoliaSaveDoc = function(orgId, algoliaDoc) {
  const index = client.initIndex(orgId );

  index.saveObject(algoliaDoc)
    .then()
    .catch((err) => console.log(err));
}

export const  algoliaInitIndexAndGetSearchKey = function(orgId) {

  const index = client.initIndex(orgId );
  index.setSettings({
    searchableAttributes: [
      'name','plainText',
    ]
  });

  return client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, {restrictIndices: orgId});
}
