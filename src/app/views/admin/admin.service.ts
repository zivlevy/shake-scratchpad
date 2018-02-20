import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AuthService} from '../../core/auth.service';
import {Observable} from 'rxjs/Observable';
import {FirestoreService} from '../../core/firestore.service';

@Injectable()
export class AdminService {

  constructor(private authService: AuthService,
              private firestoreService: FirestoreService,
              private afs: AngularFirestore) { }

  getOrgs$(): Observable<any> {

    const orgsRef: AngularFirestoreCollection<any> = this.afs.collection<any>('org');

    return orgsRef.snapshotChanges()
      .switchMap((result: Array<any>) => {
        return Observable.forkJoin(
          result.map(org => {
            const orgsRefInfo: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${org.payload.doc.id}/publicData/info`);
            return orgsRefInfo.valueChanges().take(1);
          }));
      });
  }

  deleteOrg(orgId: string) {
    const publicData = this.firestoreService.deleteCollection(`org/${orgId}/publicData`, 5);
    const docs = this.firestoreService.deleteCollection(`org/${orgId}/docs`, 5);
    const docAcks = this.firestoreService.deleteCollection(`org/${orgId}/docsAcks`, 5);
    const users = this.firestoreService.deleteCollection(`org/${orgId}/users`, 5);
    const invites = this.firestoreService.deleteCollection(`org/${orgId}/invites`, 5);
    const userSignatures = this.firestoreService.deleteCollection(`org/${orgId}/userSignatures`, 5);

    Observable.merge(publicData, docs, docAcks, users, invites, userSignatures)
      .subscribe(
        res => console.log(res),
        err => console.log(err),
        () => {
          this.afs.collection('org').doc(orgId).delete()
            .catch(err => console.log(err));
        }
      );
  }

}
