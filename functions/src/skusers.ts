import * as functions from 'firebase-functions'
import * as admin from "firebase-admin";


export const deleteUser = functions
  .auth.user().onDelete(event =>{
    const uid = event.data.uid;
    const db = admin.firestore();

    const userRef = db.collection('users').doc(uid);
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

// This is effective only when user is added in response to an invite
export const userAddOrg = functions.firestore.document(`users/{uid}/orgs/{orgId}`).onCreate((event) => {
  const uid = event.params.uid;
  const orgId = event.params.orgId;

  const db = admin.firestore();
  const userRef = db.doc(`users/${uid}`);
  return userRef.get()
    .then((user: any) => {
      const inviteRef = db.doc(`org/${orgId}/invites/${user.data().email}`);
      return inviteRef.get()
        .then(invite => {
          if (invite.data()) {
            const inviteRefDelete = db.doc(`org/${orgId}/invites/${user.data().email}`).delete();
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


