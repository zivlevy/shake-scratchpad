const functions = require('firebase-functions');
import * as admin from 'firebase-admin'

export const bigben = functions.https.onRequest((req, res) => {

  const hours = (new Date().getHours() % 12) + 1 // london is UTC + 1hr;
  res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${'BONG '.repeat(hours)}
    </body>
  </html>`);
});
