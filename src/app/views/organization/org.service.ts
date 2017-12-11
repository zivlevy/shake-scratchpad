import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import {ChildActivationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {OrgUser} from '../../model/org-user';

@Injectable()
export class OrgService {
  private currentOrg$: BehaviorSubject<string> = new BehaviorSubject('');
  isAuthenticated: boolean;
  private orgPublicData: any; // local copy of org public data

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router) {

    this.router.events
      .filter((event) => {
        return event instanceof ChildActivationEnd;
      })
      .filter((event: any) => {
        return event.snapshot._lastPathIndex === 1;
      })
      .map(event => event.snapshot.params.id)
      .distinctUntilChanged()
      .subscribe((id: any) => {
        this.setOrganization(id);
      });

    // get user authentication
    this.authService.isAuth$()
      .subscribe(isAuth => this.isAuthenticated = isAuth);


  }

  private setOrganization(orgID: string) {
    console.log('setting current org to:' + orgID);
    this.currentOrg$.next(orgID);

  }

  /************************
   Org User API
   ************************/
  // user login to shake and org and register to shake if needed
  loginToOrg(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        if (user) {
          // get the user from the org db
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          userRef.valueChanges().take(1).subscribe(orgUser => {
            if (orgUser) {
              this.router.navigate([`org/${this.currentOrg$.getValue()}`]);
            } else {
              // user doesn't exist - create it
              this.setUserDoc(user)
                .then( () =>
                  this.router.navigate([`org/${this.currentOrg$.getValue()}/userDetails`])
              );
            }
          });
        }
      }).catch(err => {
        console.log(err);
        if (err.code === 'auth/user-not-found') {
          this.emailSignUp(email, password).then(() => {
            this.router.navigate([`org/${this.currentOrg$.getValue()}/userDetails`]);
          });
        }
    });
  }

  joinToOrg() {
    this.setUserDoc(this.afAuth.auth.currentUser)
      .then( () =>
        this.router.navigate([`org/${this.currentOrg$.getValue()}/userDetails`])
      );
  }

  // user sign-up by email
  emailSignUp(email: string, password: string) {
    return this.authService.emailSignUp(email, password)
      .then(user => this.setUserDoc(user))
      .catch((err) => {
        console.log(err);
      });
  }

  // Sets initial user data to firestore after successful sign-up
  private setUserDoc(user) {
    const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
    const data: OrgUser = {
      uid: user.uid,
      email: user.email || null,
      isPending: true,
      roles: null
    };
    return userRef.set(data);
  }

  // Update additional user data to firestore
  updateOrgUser(uid: string, userData: OrgUser) {
    console.log(uid);
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.update(userData).then(() => {
      this.router.navigate([`org/${this.currentOrg$.getValue()}`]);
    });
  }

  getOrgUser$() {
    return this.afAuth.authState
      .switchMap((user => {
        if (!user) {
          return Observable.of(null);
        } else {
          console.log(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          return userRef.valueChanges();
        }
      }));
  }

  /***************************
   Authorization and abilities
   **************************/

  canRead(user: OrgUser): boolean {
    const allowed = ['admin', 'editor', 'subscriber'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: OrgUser): boolean {
    const allowed = ['admin', 'editor'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: OrgUser): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

// determines if user has matching role
  private checkAuthorization(user: OrgUser, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }
    for (const role of allowedRoles) {
      if (user.roles[role]) {
        return true;
      }
    }
    return false;
  }

  /************************
   Org API
   ************************/

  getCurrentOrg$(): Observable<string> {
    return this.currentOrg$.asObservable();
  }

  getOrgPublicData$(): Observable<any> {
    const orgId = this.currentOrg$.getValue();
    if (orgId === '') {
      return Observable.of(null);
    }

    if (this.currentOrg$.getValue() === orgId && this.orgPublicData) {
      return Observable.of(this.orgPublicData);
    }

    return this.currentOrg$
      .distinctUntilChanged()
      .switchMap(newOrgId => {
        if (!newOrgId) {
          return Observable.of(null);
        }
        const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${newOrgId}/publicData/info`);
        return document.valueChanges()
          .map(orgData => {
            if (orgData) {
              this.orgPublicData = orgData;
              return orgData;
            } else {
              this.orgPublicData = null;
              return null;
            }
          });
      });
  }


  /************************
   Org Documents API
   ************************/
}
