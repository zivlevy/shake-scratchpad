import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {OrgUser} from "../model/org-user";

@Injectable()
export class HomeService {

  constructor(private afs: AngularFirestore,
              private router: Router) { }

   setNewOrg(org:any) {
    const orgDocRef: AngularFirestoreDocument<any> = this.afs.collection(`orgRequested`).doc(org);

    // return orgCollectionRef.valueChanges().subscribe(orgi => console.log(orgi));
    return orgDocRef.set({createdBy: 'zivi', orgName: org});
  }

}
