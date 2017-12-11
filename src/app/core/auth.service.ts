import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';

import 'rxjs/add/operator/switchMap';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase';
import UserCredential = firebase.auth.UserCredential;
import {User} from 'firebase';



@Injectable()
export class AuthService {
    private languadge$: BehaviorSubject<string> = new BehaviorSubject('en');

    constructor(private afAuth: AngularFireAuth,
                private afs: AngularFirestore,
                private router: Router) {

    }


    //// Email/Password Auth ////
    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
          .then(user => {
            console.log(user);
            user.sendEmailVerification().then(() => {console.log('email sent'); })
              .catch(err => console.log(err));
          });
    }

    login(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
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

    getUser$(){
      return this.afAuth.authState;
    }

    setLanguadge(lng) {
        this.languadge$.next(lng);
    }

    getLanguadge$ () {
        return this.languadge$.asObservable();
    }
}
