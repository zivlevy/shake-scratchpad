import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';
import {AlgoliaDoc} from '../model/algolia-doc';

@Injectable()
export class AlgoliaService {

  algoliaAppId: string;
  algoliaSearchKey: string;

  constructor() {
    this.algoliaAppId = environment.algolia.appId;
    this.algoliaSearchKey = environment.algolia.searchKey;
  }

  searchDocs(orgId: string, orgSearchKey: string, lang: string, searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {
    let restrictSearchAttr;
    let filter = '';
    if (edited) {
      filter = 'docType:e';
    }
    if (published) {
      filter = filter + (filter.length > 0 ? ' OR docType:p' : 'docType:p');
    }
    if (versions) {
      filter = filter + (filter.length > 0 ? ' OR docType:v' : 'docType:v');
    }

    if (namesOnly) {
      restrictSearchAttr = ['name'];
    } else {
      restrictSearchAttr = ['name', 'plainText'];
    }
    // if (edited) filter = filter + ' OR docType:e';

    const client = algoliasearch(this.algoliaAppId, orgSearchKey);
    const index = client.initIndex(orgId);
    return new Promise <Array<AlgoliaDoc>>((resolve, reject) => {
      const query0 = index.search({restrictSearchableAttributes: restrictSearchAttr, query: searchString, filters: filter });
      let query1, query2;
      switch (lang) {
        case 'he':
          query1 = index.search({restrictSearchableAttributes: restrictSearchAttr, query: 'ה' + searchString, filters: filter });
          query2 = index.search({restrictSearchableAttributes: restrictSearchAttr, query: 'ו' + searchString, filters: filter });
          break;
        default:
          query1 = Promise.reject;
          query2 = Promise.reject;
      }
        Promise.all([query0, query1, query2])
        .then((res: any) => {
          const results = [];
          res.forEach(specificRes => {
            if (specificRes.hits) {
              specificRes.hits.forEach(hit => {
                const i = results.findIndex(rec => rec.docId === hit.docId && rec.docType === hit.docType);
                if (i === -1) {
                  results.push(hit);
                } else {
                  if (hit.docType === 'v' && results[i].version !== hit.version) {
                    results.push(hit);
                  }
                }
              });
            }

          });

          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

  testAlgolia() {
    const client = algoliasearch(this.algoliaAppId, this.algoliaSearchKey);
    const index = client.initIndex('_algoliaTestIndex');

    return new Promise<boolean>((resolve) => {
      index.search('data')
        .then(res => {
          resolve(true);
        })
        .catch(err => {
          resolve(false);
          console.log(err);
        });
    });

  }

}

