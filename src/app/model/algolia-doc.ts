class AlgoliaDocVersion {
  'name': string;
  'plainText': string;
}

export class AlgoliaDoc {
  'published': AlgoliaDocVersion;
  'edited': AlgoliaDocVersion;
  'versions': Array<AlgoliaDocVersion>;
}
