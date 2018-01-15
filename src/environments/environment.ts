// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
      // apiKey: 'AIzaSyAy3oqTQVzqjFnu1DfNhCOQbawEfPIb108',
      // authDomain: 'shake-c53cb.firebaseapp.com',
      // databaseURL: 'https://shake-c53cb.firebaseio.com',
      // projectId: 'shake-c53cb',
      // storageBucket: 'shake-c53cb.appspot.com',
      // messagingSenderId: '45118857441'

      //
      apiKey: 'AIzaSyDOOWEQ87E_y1eCAHzQxm-z0IcoNo8zj6Q',
      authDomain: 'shakesb05.firebaseapp.com',
      databaseURL: 'https://shakesb05.firebaseio.com',
      projectId: 'shakesb05',
      storageBucket: 'shakesb05.appspot.com',
      messagingSenderId: '739906729900'

    },
    algolia: {
      appId: 'OH29RANN3N'
    }
};
