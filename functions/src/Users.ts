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
