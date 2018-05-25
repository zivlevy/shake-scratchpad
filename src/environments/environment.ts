// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: 'DEV',
  domain: {
    name: 'http://localhost:4200'
  },
  firebase: {
    apiKey: 'AIzaSyDwhlfoyY89v88KaPc99UYaDXgk0Lx4fr4',
    authDomain: 'shakescratchpad.firebaseapp.com',
    databaseURL: 'https://shakescratchpad.firebaseio.com',
    projectId: 'shakescratchpad',
    storageBucket: 'shakescratchpad.appspot.com',
    messagingSenderId: '898581880696'

  },
  algolia: {
    appId: 'OH29RANN3N'
  },
  froala: {
    key: 'BB7C5B3D4yB2G2B1A17A13A2A1C7E1F2lbzrC-21pB2yA-9mmtnv=='
  }
};
