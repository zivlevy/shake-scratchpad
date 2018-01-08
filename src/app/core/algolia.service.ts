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

  getCurrentDocsByNames(orgId: string, orgSearchKey: string, searchString: string) {
    const client = algoliasearch(this.algoliaAppId, orgSearchKey);
    const index = client.initIndex(orgId);
    return new Promise <Array<AlgoliaDoc>>((resolve, reject) => {
      index.search({restrictSearchableAttributes: ['edited.name', 'published.name'], query: searchString})
        .then(res => resolve(res.hits))
        .catch(err => reject(err));
    });
  }

  getCurrentDocsByAnyField(orgId: string, orgSearchKey: string, searchString: string) {
    const client = algoliasearch(this.algoliaAppId, orgSearchKey);
    const index = client.initIndex(orgId);
    return new Promise <Array<AlgoliaDoc>>((resolve, reject) => {
      index.search({restrictSearchableAttributes: ['published.name', 'published.plainText', 'edited.name', 'edited.plainText'],
        query: searchString})
        .then(res => resolve(res.hits))
        .catch(err => reject(err));
    });
  }

  getHistoryDocsByAnyField(orgId: string, orgSearchKey: string, searchString: string) {
    const client = algoliasearch(this.algoliaAppId, orgSearchKey);
    const index = client.initIndex(orgId);
    return new Promise <Array<AlgoliaDoc>>((resolve, reject) => {
      index.search({restrictSearchableAttributes: ['versions.name', 'versions.plainText'],
        query: searchString})
        .then(res => resolve(res.hits))
        .catch(err => reject(err));
    });
  }
}

