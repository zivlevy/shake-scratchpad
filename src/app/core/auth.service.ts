import {Injectable} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';

import {Observable} from 'rxjs';
import {FirestoreService} from './firestore.service';
import {SkUser} from '../model/user';
import 'rxjs/add/operator/take';



@Injectable()
export class AuthService {
    private currentAuthUser;
    private currentSkUser: SkUser;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private firestoreService: FirestoreService) {

      this.getUser$().subscribe(user => {
        if (user) {
          this.currentAuthUser = user;
        }
      });

      this.getSkUser$().subscribe(user => {
        if (user) {
          this.currentSkUser = user;
        }
      });
    }


    //// Email/Password Auth ////
    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    login(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    createUserInitialData (uid, email, displayName) {
      return this.afs.doc(`users/${uid}`).set({displayName, uid, email});
    }

    logout() {
      return this.afAuth.auth.signOut();
    }

    sendEmailVerification(){
      return this.currentAuthUser.sendEmailVerification();
    }

    resetPassword(email: string) {
      return this.afAuth.auth.sendPasswordResetEmail(email)
        .catch(err => console.log(err));
    }

    isAuth$() {
        return this.afAuth.authState
            .map(user => {
                if (! user) {
                    return false;
                }
                return !user.isAnonymous && user.emailVerified  ;
              });
    }

    getUser$() {
      return this.afAuth.authState;
    }

    getSkUser$(): Observable<any>{
      return this.getUser$().switchMap(user => {
         return user ? this.afs.doc(`users/${user.uid}`).valueChanges() : Observable.of(null);
      });
    }

    updateUserProfile(uid, displayName, photoURL): Promise<any> | null {
      if (displayName && photoURL) {
        return this.afs.doc(`users/${uid}`).update({displayName, photoURL});
      }

      if (displayName) {
        return this.afs.doc(`users/${uid}`).update({displayName});
      }

      if (photoURL) {
        return this.afs.doc(`users/${uid}`).update({photoURL});
      }

      return Promise.resolve();
    }

    updateUserEmail(newEmail: string): Promise<any> {
      return this.afAuth.auth.currentUser.updateEmail(newEmail)
        .then(() => {
          this.afs.doc(`users/${this.currentSkUser.uid}`).update({email: newEmail})
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }

    isSkAdmin$(uid: string): Observable<boolean> {
      return this.afs.doc(`skAdmins/${uid}`).valueChanges()
        .map((res: any) => {
          return res ? res.isSkAdmin : null;
        });
    }

    isCurrentSkAdmin$(): Observable<boolean> {
      return this.getSkUser$()
        .switchMap(user => {
          return this.afs.doc(`skAdmins/${user.uid}`).valueChanges()
            .map((res: any) => {
              return res ? res.isSkAdmin : null;
            });
        });
    }


    isSkEditor$(uid: string): Observable<boolean> {
      return this.afs.doc(`skAdmins/${uid}`).valueChanges()
        .map((res: any) => {
          return res ? res.isSkEditor : null;
        });
    }

    isCurrentSkEditor$(): Observable<boolean> {
      return this.getSkUser$()
        .switchMap(user => {
          return this.afs.doc(`skAdmins/${user.uid}`).valueChanges()
            .map((res: any) => {
              return res ? res.isSkEditor : null;
            });
        });
    }

    getUsers$(): Observable<any> {
      return this.firestoreService.colWithIds$(`users`)
        .map(users => users.filter(user => !user.isSkAdmin));
    }

    getSkAdmins$(): Observable<any> {
      return this.firestoreService.colWithIds$('skAdmins')
        .map(resArray => {
          resArray.forEach(res => {
            this.afs.doc(`users/${res.id}`).valueChanges()
              .take(1)
              .subscribe((userData: any) => {
                res.displayName = userData.displayName;
                res.photoURL = userData.photoURL;
                res.email = userData.email;
              });
          });
          return resArray;
        });
    }

    getOrgUsers$(orgId: string): Observable<any> {
      return this.firestoreService.colWithIds$(`org/${orgId}/users`)
        .map(resArray => {
          resArray.forEach(res => {
            this.afs.doc(`users/${res.id}`).valueChanges()
              .take(1)
              .subscribe((userData: any) => {
                res.displayName = userData.displayName;
                res.photoURL = userData.photoURL;
                res.email = userData.email;
              });
          });
          return resArray;
        });
    }

    set2Admin(uid: string, isSkAdmin: boolean, isSkEditor: boolean): Promise<any> {
      const addToSkAdmins = this.afs.collection('skAdmins').doc(uid).set({uid, 'isSkAdmin': isSkAdmin, 'isSkEditor': isSkEditor});

      const addToUsers = this.afs.doc(`users/${uid}`).update({
        'isSkAdmin': true
      });

      return Promise.all([addToSkAdmins, addToUsers])
        .then()
        .catch();
    }

    setAdmin2User(uid: string): Promise<any> {
      const removeFromSkAdmins = this.afs.collection('skAdmins').doc(uid).delete();

      const addToUsers = this.afs.doc(`users/${uid}`).update({
        'isSkAdmin': false
      });

      return Promise.all([removeFromSkAdmins, addToUsers])
        .then()
        .catch();
    }

  getUserOrgs$ (uid: string): Observable<any> {
    return this.firestoreService.colWithIds$(`users/${uid}/orgs`);
  }

  isMailRegistered(mail: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.afAuth.auth.fetchProvidersForEmail(mail)
        .then(res => {
          if (res.length === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch(err => console.log(err));
    });
  }


}
