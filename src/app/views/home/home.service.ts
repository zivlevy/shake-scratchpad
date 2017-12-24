import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';

@Injectable()
export class HomeService {
  currentSkUser;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private authService: AuthService) {
    this.authService.getSkUser$().subscribe(user => {
      this.currentSkUser = user;
      console.log(this.currentSkUser);
    });
  }

  setNewOrg(orgId: string, orgName: string, country: string, sector: string) {
    const orgDocRef: AngularFirestoreDocument<any> = this.afs.collection(`orgRequested`).doc(orgId);
    const org = {
      orgId: orgId,
      orgName: orgName,
      country: country,
      sector: sector,
      createdBy: this.currentSkUser.uid,
      displayName: this.currentSkUser.displayName,
      email: this.currentSkUser.email,
      photoURL: this.currentSkUser.photoURL
    };
    return orgDocRef.set(org);
  }

  getCountrySectors$(country: string) {
    const sectorsCollection: AngularFirestoreCollection<any> = this.afs.collection('countries').doc(country).collection('sectors');
    return sectorsCollection.snapshotChanges().map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return {id, ...data};
      });
    });
  }

  getOrgs$() {
    const orgCollection: AngularFirestoreCollection<any> = this.afs.collection('org');
    return orgCollection.snapshotChanges().map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return {id, ...data};
      });
    });
  }

}
