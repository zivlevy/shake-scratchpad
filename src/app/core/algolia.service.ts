import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import * as algoliasearch from 'algoliasearch';
import {AlgoliaDoc} from '../model/algolia-doc';
import {reject} from 'q';

@Injectable()
export class AlgoliaService {

  algoliaAppId: string;

  constructor() {
    this.algoliaAppId = environment.algolia.appId;
  }

  searchDocs(orgId: string, orgSearchKey: string, searchString: string, namesOnly: boolean, edited: boolean, published: boolean, versions: boolean) {
    let restrictSearchAttr;
    let filter = 'docType:e';
    if (namesOnly) {
      restrictSearchAttr = ['name'];
    } else {
      restrictSearchAttr = ['name', 'plainText'];
    }
    // if (edited) filter = filter + ' OR docType:e';

    const client = algoliasearch(this.algoliaAppId, orgSearchKey);
    const index = client.initIndex(orgId);
    return new Promise <Array<AlgoliaDoc>>((resolve, reject) => {
      index.search({restrictSearchableAttributes: restrictSearchAttr, query: searchString, filters: filter})
        .then(res => resolve(res.hits))
        .catch(err => reject(err));
    });
  }

}

