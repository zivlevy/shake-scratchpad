"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algoliasearch = require('algoliasearch');
const ALGOLIA_APP_ID = 'OH29RANN3N';
const ALGOLIA_ADMIN_KEY = 'f1f950108fd8021579f04e68fc73e9e2';
const ALGOLIA_SEARCH_KEY = 'ce92e39e78c39981be8c2946500374b4';
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
class AlgoliaDoc {
}
exports.AlgoliaDoc = AlgoliaDoc;
exports.algoliaSaveDoc = function (orgId, algoliaDoc) {
    const index = client.initIndex(orgId);
    return index.saveObject(algoliaDoc);
};
exports.algoliaInitIndex = function (orgId) {
    const index = client.initIndex(orgId);
    return index.setSettings({
        searchableAttributes: [
            'name', 'plainText'
        ],
        attributesForFaceting: [
            'docType', 'version'
        ]
    });
};
exports.algoliaGetSearchKey = function (orgId) {
    return client.generateSecuredApiKey(ALGOLIA_SEARCH_KEY, { restrictIndices: orgId });
};
//# sourceMappingURL=algolia.js.map