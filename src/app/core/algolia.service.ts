import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';
import {AlgoliaDoc} from '../model/algolia-doc';

@Injectable()
export class AlgoliaService {

  algoliaAppId: string;

  constructor() {
    this.algoliaAppId = environment.algolia.appId;
  }

  searchDocs(orgId: string, orgSearchKey: string, searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {
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
      index.search({restrictSearchableAttributes: restrictSearchAttr, query: searchString, filters: filter })
        .then(res => {
          const results = [];
          res.hits.forEach(hit => {
            const i = results.findIndex(rec => rec.docId === hit.docId && rec.docType === hit.docType);
            if (i === -1) {
              results.push(hit);
            }
          });
          resolve(results);
        })
        .catch(err => reject(err));
    });
  }

}

