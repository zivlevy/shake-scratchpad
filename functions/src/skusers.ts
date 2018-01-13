import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";


export const deleteUser = functions
  .auth.user().onDelete(event =>{
    const uid = event.data.uid;
    const db = admin.firestore();

    const userRef = db.collection('users').doc(uid)
    userRef.delete();
    return 0;
  });


export const updateUserInfo = functions.firestore
  .document(`users/{uid}`).onUpdate((event) => {
    const uid = event.params.uid;
    const data = event.data.data();

    const displayName = data.displayName;
    const email = data.email;
    const photoURL = data.photoURL;

    const db = admin.firestore();
    const usersRef = db.collection(`users/${uid}/orgs`);
    usersRef.get().then(querySnapshot => {
      querySnapshot.forEach(documentSnapshot => {
        const orgUsersRef = db.collection(`org/${documentSnapshot.ref.id}/users`).doc(`${uid}`);
        orgUsersRef.update({displayName, email, photoURL}).catch()
      });
    });
    return 0;
  });


