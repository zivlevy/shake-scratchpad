import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";


export const deleteUser = functions
  .auth.user().onDelete((userMetadata, context) =>{
    const uid = userMetadata.uid;
    const db = admin.firestore();

    const userRef = db.collection('users').doc(uid);
    userRef.delete();
    return 0;
  });

export const updateUserInfo = functions.firestore
  .document(`users/{uid}`).onUpdate((data, context) => {
    const uid = context.params.uid;
    const userData = data.after.data();

    const displayName = userData.displayName;
    const email = userData.email;
    const photoURL = userData.photoURL;

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

// This is effective only when user is added in response to an invite
export const userAddOrg = functions.firestore.document(`users/{uid}/orgs/{orgId}`).onCreate((data, context) => {
  const uid = context.params.uid;
  const orgId = context.params.orgId;

  const db = admin.firestore();
  const userRef = db.doc(`users/${uid}`);
  return userRef.get()
    .then((user: any) => {
      const uemail = user.data().email.toLowerCase();
      const inviteRef = db.doc(`org/${orgId}/invites/${uemail}`);
      return inviteRef.get()
        .then(invite => {
          if (invite.data()) {
            const inviteRefDelete = db.doc(`org/${orgId}/invites/${uemail}`).delete();
            const orgUserSet = db.doc(`org/${orgId}/users/${uid}`).set({
                isPending: false,
                roles: {
                  admin: invite.data().isAdmin,
                  editor:invite.data().isEditor,
                  viewer: invite.data().isViewer
                },
                displayName: user.data().displayName,
                email: user.data().email,
                photoURL: user.data().photoURL ? user.data().photoURL : ''
            });
            return Promise.all([inviteRefDelete, orgUserSet])
              .catch(err => console.log(err));
          } else {
            return Promise.resolve();
          }
        })


    })
});


