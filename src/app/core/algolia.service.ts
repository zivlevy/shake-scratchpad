import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';

@Injectable()
export class AlgoliaService {

  algoliaAppId: string;

  constructor() {
    this.algoliaAppId = environment.algolia.appId;
  }

  getSearchResults(orgId: string, orgSearchKey: string, searchString: string) {

    return new Promise <Array<any>>((resolve, reject) => {
      const client = algoliasearch(this.algoliaAppId, orgSearchKey);
      const index = client.initIndex(orgId);
      const result = new Array<string>();
      index.search({ query: searchString }, function searchDone(err, content) {
        if (err) {
          reject(err);
        }

        for (const hit of content.hits) {
          // this.result.push(`${content.hits[h].toString()}`);
          result.push(hit.text);
        }
        resolve(result);
      });
    });
  }
}

