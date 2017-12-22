import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';

@Injectable()
export class HomeService {
  currentUser;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private authService: AuthService) {
    this.authService.getUser$().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  setNewOrg(orgId: string, orgName: string, country: string, sector: string) {
    const orgDocRef: AngularFirestoreDocument<any> = this.afs.collection(`orgRequested`).doc(orgId);
    const org = {orgId: orgId, orgName: orgName, country: country,  sector: sector, createdBy: this.currentUser.uid,
      userName: this.currentUser.displayName};
    return orgDocRef.set(org);
  }

  getCountrySectors$(country: string) {
    const sectorsCollection: AngularFirestoreCollection<any> = this.afs.collection('countries').doc(country).collection('sectors');
    return sectorsCollection.snapshotChanges().map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data};
      });
    });
  }

  test() {
    console.log('test');

    const sectorsCollection: AngularFirestoreDocument<any> = this.afs.collection('countries').doc('Israel')
      .collection('sectors').doc('Pizza');
    return sectorsCollection.snapshotChanges().map(snap => {
        console.log(snap.payload.data().icon_url);
    }).subscribe();
  }
}
