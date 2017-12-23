import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';
import {Observable} from "rxjs/Observable";

@Injectable()
export class HomeService {
  currentUser;

  constructor(private afs: AngularFirestore,
              private router: Router,
              private authService: AuthService) {
    this.authService.getSkUser$().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  setNewOrg(orgName: string) {
    const orgDocRef: AngularFirestoreDocument<any> = this.afs.collection(`orgRequested`).doc(orgName);
    const org = {name: orgName, createdBy: this.currentUser.uid, displayName: this.currentUser.displayName};
    // return orgCollectionRef.valueChanges().subscribe(orgi => console.log(orgi));
    return orgDocRef.set(org);
  }

  getCountrySectors(country: string) {
    const sectorsCollection: AngularFirestoreCollection<any> = this.afs.collection('countries').doc(country).collection('sectors');
    const sectorsObservable = sectorsCollection.snapshotChanges().map(arr => {
      return arr.map(snap => {
        const data = snap.payload.doc.data();
        const id = snap.payload.doc.id;
        return { id, ...data};
      });
    })

    return sectorsObservable.take(1);
  }
}
