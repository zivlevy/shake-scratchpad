import { Injectable } from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {FirestoreService} from '../../core/firestore.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/count';

@Injectable()
export class OrgDocService {

  constructor(private afs: AngularFirestore,
              private firestoreService: FirestoreService,
              ) { }

  getOrgDocsAcks$ (orgId: string): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/docsAcks`)
      .map(docsAcks => {
        docsAcks.forEach(docAck => {
          this.afs.doc(`org/${orgId}/docs/${docAck.docId}`).valueChanges()
            .take(1)
            .subscribe((doc: any) => {
              docAck.docName = doc.name;
            });
        });
        return docsAcks;
      });
  }

  updateDocsAcksFieldP(orgId: string, readAckId: string, fieldName: string, action: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const ref = this.afs.collection('org').doc(orgId).collection('docsAcks').doc(readAckId);
      ref.valueChanges().take(1)
        .subscribe((original: any) => {
          if (action === 'inc') {
            original[fieldName] = original[fieldName] + 1;
          } else {
            if (original[fieldName] > 0) {
              original[fieldName] = original[fieldName] - 1;
            } else {
              original[fieldName] = 0;
            }
          }
          ref.update(original)
            .then(() => {
              resolve();
            })
            .catch(err => {
              console.log(err);
              reject();
            });
        });
    });
  }



}
