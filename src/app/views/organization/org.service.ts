import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import {ChildActivationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {OrgUser} from '../../model/org-user';
import * as firebase from 'firebase';

@Injectable()
export class OrgService {
  private currentOrg$: BehaviorSubject<string> = new BehaviorSubject('');
  isAuthenticated: boolean;
  private orgPublicData: any; // local copy of org public data
  private localCurrentOrg: string;
  private currentSkUser;

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router
              ) {

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
    this.localCurrentOrg = orgID;
    this.currentOrg$.next(orgID);

  }

  /************************
   Org User API
   ************************/

  joinToOrg() {
    this.authService.getSkUser$()
      .take(1)
      .subscribe(skUser => {
        this.setUserInfo(skUser)
          .then(() => {
            this.router.navigate([`org/${this.currentOrg$.getValue()}`]);
          });
      } );

  }

  // Sets initial user data to firestore after successful org Join
  private setUserInfo(user) {
    // set the org to the user
    const orgUserRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}/orgs/${this.currentOrg$.getValue()}`);
    orgUserRef.set({});

    // set the user data in the org
    const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
    const data: OrgUser = {
      uid: user.uid,
      isPending: true,
      roles: {}, // must be empty object for permission
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
    return userRef.set(data);
  }

  // Update additional user data
  updateOrgUser(uid: string, userData: OrgUser) {
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.update(userData);
  }

  // Delete additional user data
  deleteOrgUser(uid: string) {
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.delete();
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
   Org Admin API
   ************************/
  getOrgUsersList$() {
    const orgUsersRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/users`);
    return orgUsersRef.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as OrgUser;
        const id = a.payload.doc.id;
        return { uid: id, ...data };
      });
    });
  }
}

