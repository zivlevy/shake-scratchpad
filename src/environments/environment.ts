// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    firebase: {
      apiKey: "AIzaSyDwhlfoyY89v88KaPc99UYaDXgk0Lx4fr4",
      authDomain: "shakescratchpad.firebaseapp.com",
      databaseURL: "https://shakescratchpad.firebaseio.com",
      projectId: "shakescratchpad",
      storageBucket: "shakescratchpad.appspot.com",
      messagingSenderId: "898581880696"

    }
};
