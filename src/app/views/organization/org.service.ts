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
  private orgPublicData$: BehaviorSubject<any> = new BehaviorSubject({});
  private orgPrivateData$: BehaviorSubject<any> = new BehaviorSubject({});
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

    // set org public data updates
    this.updateOrgPublicData();
    this.updateOrgPrivateData();

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
      photoURL: user.photoURL ? user.photoURL : ''
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
          // console.log(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          return userRef.valueChanges();
        }
      }));
  }



  /***************************
   Private functions
   **************************/

 private updateOrgPublicData() {

    this.currentOrg$
      .distinctUntilChanged()
      .switchMap(newOrgId => {
        if (!newOrgId) {
          return Observable.of(null);
        }
        const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${newOrgId}/publicData/info`);
        return document.valueChanges()
          .map(orgData => {
            console.log('here');
            if (orgData) {
              return orgData;
            } else {
              return null;
            }
          });
      }).subscribe(orgPublicData => this.orgPublicData$.next(orgPublicData));
  }

  private updateOrgPrivateData() {

    this.currentOrg$
      .distinctUntilChanged()
      .switchMap(newOrgId => {
        if (!newOrgId) {
          return Observable.of(null);
        }
        const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${newOrgId}/privateData/info`);
        return document.valueChanges()
          .map(orgData => {
            if (orgData) {
              return orgData;
            } else {
              return null;
            }
          });
      }).subscribe(orgPrivateData => this.orgPrivateData$.next(orgPrivateData));
  }

  /************************
   Org API
   ************************/

  getCurrentOrg$(): Observable<string> {
    return this.currentOrg$.asObservable();
  }



  getOrgPublicData$(): Observable<any> {
    return this.orgPublicData$.asObservable();
  }

  getOrgPrivateData$(): Observable<any> {
    return this.orgPrivateData$.asObservable();
  }

  // Written by Ran
  setOrgPublicData(orgId, newData) {
    const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}/publicData/info`);
    return document.update(newData);
  }

  uploadDocument(docName: string, docText: string, docFormattedText: string) {
    const orgDocumentsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/privateDocuments`);

    const data = {
      docName: docName,
      docText: docText,
      docFormattedText: docFormattedText
    };

    orgDocumentsRef.add(data)
      .then(() => console.log('successfully saved'))
      .catch(err => console.log(err));
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

