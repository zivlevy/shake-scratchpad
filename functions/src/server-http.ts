const functions = require('firebase-functions');
import * as admin from 'firebase-admin'
const defaultFirestore = admin.firestore();
export const bigben = functions.https.onRequest((req, res) => {

  const sz = defaultFirestore.collection('org').doc('SZMC');
  sz.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        const dat = doc.data();
        console.log('Document data:', dat);
        res.status(200).send(`<!doctype html>
    <head>
      <title>Time</title>
    </head>
    <body>
      ${JSON.stringify(dat)}
    </body>
  </html>`);

      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  // const hours = (new Date().getHours() % 12) + 1; // london is UTC + 1hr;
  // res.status(200).send(`<!doctype html>
  //   <head>
  //     <title>Time</title>
  //   </head>
  //   <body>
  //     ${'BONG '.repeat(hours)}
  //   </body>
  // </html>`);
});
