import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import {User} from 'firebase';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class AuthService {
    private currentAuthUser;
    private currentSkUser;

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private router: Router) {

      this.getUser$().subscribe(user => {
        if (user) {
          console.log(user);
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
      this.afAuth.auth.signOut();
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
      if (this.currentSkUser) {
        displayName = displayName ? displayName : this.currentSkUser.displayName;
        photoURL = photoURL ? photoURL : this.currentSkUser.photoURL;
      }
      return this.afs.doc(`users/${uid}`).update({displayName, photoURL});
    }

    updateUserEmail(newEmail: string): Promise<any> {
      return this.afAuth.auth.currentUser.updateEmail(newEmail).then(() => {
        this.afs.doc(`users/${this.currentSkUser.uid}`).update({email: newEmail});
      });
    }

    isSkAdmin(uid: string): Observable<boolean> {
      console.log('a', uid);
      return this.afs.doc(`skAdmins/${uid}`).valueChanges()
        .map(res => {
          return res === null ? false : true;
        });
      ;
    }

  isSkEditor(uid: string): Observable<boolean> {
    console.log('a', uid);
    return this.afs.doc(`skEditors/${uid}`).valueChanges()
      .map(res => {
        return res === null ? false : true;
      });
    ;
  }
}
