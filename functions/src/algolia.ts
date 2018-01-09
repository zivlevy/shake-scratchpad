const algoliasearch = require('algoliasearch');

const ALGOLIA_APP_ID = 'OH29RANN3N';
const ALGOLIA_ADMIN_KEY = 'f1f950108fd8021579f04e68fc73e9e2';
const ALGOLIA_SEARCH_KEY = 'ce92e39e78c39981be8c2946500374b4';

const client= algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

export const convert2AlgoliaDoc = function (docId, fireBaseDoc) {
  const res = {
    objectID: docId,
    edited: {},
    published: {},
    versions: []
  };

  if ( fireBaseDoc.editVersion !== undefined) {
    res.edited = {
      'name': fireBaseDoc.editVersion.name,
      'plainText': fireBaseDoc.editVersion.plainText
    }
  }
  if ( fireBaseDoc.publishVersion !== undefined) {
    res.published = {
      'name': fireBaseDoc.publishVersion.name,
      'plainText': fireBaseDoc.publishVersion.plainText
    }
  }

  console.log(fireBaseDoc);

  return res;
}
// export const algoliaUploadDocument = function(orgId, docId, text, formattedText) {
//   const index = client.initIndex(orgId );
//
//   const data = {
//     objectID: docId,
//     text: text,
//     formattedText: formattedText,
//   };
//   index.addObject(data)
//     .then(() => console.log('success'))
//     .catch((err) => console.log(err));
// }

export const algoliaUploadDoc = function(orgId, data) {
  const index = client.initIndex(orgId );

  index.addObject(data)
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
}

export const algoliaUpdateDoc = function(orgId, data) {
  const index = client.initIndex(orgId );

  index.saveObject(data)
    .then(() => console.log('success'))
    .catch((err) => console.log(err));
}

export const  algoliaInitIndexAndGetSearchKey = function(orgId) {

  const index = client.initIndex(orgId );
  index.setSettings({
    searchableAttributes: [
      'edited.name','edited.plainText',
      'published.name','published.plainText',
      'versions.name', 'versions.plainText'
    ]
  });

  return client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, {restrictIndices: orgId});
}
