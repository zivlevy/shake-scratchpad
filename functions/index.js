const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// exports.userAdded = functions.auth.user().onCreate(event => {
//     const user = event.data; // The Firebase user.
//
//     // Firestore database
//     const db = admin.firestore();
//
//     const userRef = db.collection('users').doc(user.uid);
//     console.log(user.uid);
//     const newUser = {uid:user.uid};
//     // Make update in firestore
//     userRef.set(newUser).then(() => {
//         console.log('finished');
//         return 0;
//     });
//
//     return 0;
// });
//
// exports.userRemoved = functions.auth.user().onDelete(event => {
//     const user = event.data; // The Firebase user.
//
//     // Firestore database
//     const db = admin.firestore();
//
//     const userRef = db.collection('users').doc(user.uid);
//     // Make update in firestore
//     userRef.delete().then(() => {
//         console.log('User Deleted');
//         return 0;
//     })
//     .catch (() => {return 1;} )
//
//     return 0;
//
// });

