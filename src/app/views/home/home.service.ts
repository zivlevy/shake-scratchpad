import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';
import {Organization} from '../../model/organization';

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

  setNewOrg(orgName: string) {
    const orgDocRef: AngularFirestoreDocument<any> = this.afs.collection(`orgRequested`).doc(orgName);
    const org = {name: orgName, createdBy: this.currentUser.uid, displayName: this.currentUser.displayName};
    // return orgCollectionRef.valueChanges().subscribe(orgi => console.log(orgi));
    return orgDocRef.set(org);
  }

}
