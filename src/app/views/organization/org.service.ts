import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import {ChildActivationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {OrgUser} from '../../model/user';

@Injectable()
export class OrgService {
    private currentOrg$: BehaviorSubject<string> = new BehaviorSubject('');

    private orgPublicData: any; // local copy of org public data

    constructor(private authService: AuthService,
                private afs: AngularFirestore,
                private  afAuth: AngularFireAuth,
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
    }

    private setOrganization(orgID: string) {
        console.log('setting current org to:' + orgID);
        this.currentOrg$.next(orgID);

    }

    /************************
     API
     ************************/
    emailSignUp(email: string, password: string) {
        return this.authService.emailSignUp(email, password)
            .then(user => this.setUserDoc(user))
            .catch ( (err) => {console.log(err); });
    }


    getOrgUser$() {
        return this.afAuth.authState
            .switchMap((user => {
                if (!user) {
                    return Observable.of(null);
                } else {
                    console.log(`org/${this.currentOrg$.getValue()}/users/${user.uid}`)
                    const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
                    return userRef.valueChanges();
                }
            }));
    }

    // Sets initial user data to firestore after succesful login
    private setUserDoc(user) {
        const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
        const data: OrgUser = {
            uid: user.uid,
            email: user.email || null,
        };
        return userRef.set(data);
    }

    // Update additional user data to firestore
    updateOrgUser(uid: string, userData: OrgUser){
        console.log(uid)
        const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
        return userRef.update(userData);
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





    getOrgDocuments$() {
        const orgCollection = this.afs.collection(`org/${this.currentOrg$.getValue()}/documents`);
        return orgCollection.valueChanges();
    }
}
