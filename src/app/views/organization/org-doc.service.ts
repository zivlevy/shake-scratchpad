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
    return this.firestoreService.colWithIds$(`org/${orgId}/docsAcks`);
  }

  deleteDocAck(orgId: string, docAckId: string, docId: string) {
    return new Promise((resolve, reject) => {

      const deleteArray = [];

      this.firestoreService.colWithIds$(`org/${orgId}/docsAcks/${docAckId}/users`)
        .take(1)
        .subscribe(users => {
          users.forEach(user => {
            console.log('user', user);
            deleteArray.push(this.afs.doc(`org/${orgId}/users/${user.id}/docsAcks/${docAckId}`).delete());
            deleteArray.push(this.afs.doc(`org/${orgId}/docsAcks/${docAckId}/users/${user.id}`).delete());
          });

        },
          null,
          () => {
          deleteArray.push(this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`).delete());
          deleteArray.push(this.afs.doc(`org/${orgId}/docs/${docId}/docAcks/${docAckId}`).delete());
          Promise.all(deleteArray)
            .then(() => resolve())
            .catch(err => reject(err));
        });
    });


  }

  getDocAckUsers$(orgId: string, docAckId: string): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/users`)
      .map(resArray => {
        resArray.forEach(res => {
          this.afs.doc(`org/${orgId}/docsAcks/${docAckId}/users/${res.id}`).valueChanges()
            // .take(1)
            .subscribe((userSignature: any) => {
              if (userSignature) {
                res.isRequired = true;
                res.hasSigned = userSignature.hasSigned;
                res.signedAt = userSignature.signedAt;
              } else {
                res.isRequired = false;
                res.hasSigned = false;
              }
            });
        });
        return resArray;
      });
  }

  isSignatureRequired$(orgId: string, uid: string, docId: string) {

    return this.firestoreService.colWithIds$(`org/${orgId}/users/${uid}/docsAcks`)
      .switchMap(docsAcks => {
        let docAckId = null;
        docsAcks.forEach((docAck: any) => {
          if (docAck.docId === docId && !docAck.hasSigned) {
            docAckId = docAck.id;
          }
        });
        return Observable.of(docAckId);
      });
  }

  // *************************************
  // Cloud Function onOrgUserDocSignCreate
  // *************************************
  userDocAckSign(orgId: string, uid: string, docAckId: string): Promise<any> {
    const timestamp = this.firestoreService.timestamp;
    return this.firestoreService.upsert(`org/${orgId}/userSignatures/${uid}`, {
      hasSigned: true,
      signedAt: timestamp,
      docAckId: docAckId
    });

  }

  // *************************************
  // Cloud Function onDocAckUserAdd
  // *************************************
  addOrgUserReqDocAck(orgId: string, docAckId: string, docAckName: string, docId: string, uid: string, userName: string): Promise<any> {
    return this.afs.collection(`org/${orgId}/docsAcks/${docAckId}/users`).doc(uid).set( { userName} )
      .catch(err => console.log(err));
  }

  // *************************************
  // Cloud Function onDocAckUserRemove
  // *************************************
  removeOrgUserReqDocAck(orgId: string, docAckId: string, uid: string): Promise<any> {
    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}/users/${uid}`).delete()
      .catch(err => console.log(err));
  }


  getOrgDocAck$(orgId: string, docAckId: string): Observable<any> {
    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`).valueChanges();
  }

  setDocAckData(orgId: string, docAckId: string, data ): Promise<any> {
    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`)
      .update(data);
  }

  // *************************************
  // Cloud Function onDocAckCreate
  // *************************************
  createNewDocAck(orgId: string, docAckName: string, docId: string, docName: string ): Promise<any> {
    const data = {
      name: docAckName,
      docId: docId,
      docName: docName,
      requiredSignatures: 0, actualSignatures: 0,
      isActive: true,
      dateCreated: this.firestoreService.timestamp
    };
    return  this.afs.collection(`org/${orgId}/docsAcks`).add(data);
  }

  removeDocAckFromDoc(orgId: string, docId: string, docAckId: string) {
    return this.afs.doc(`org/${orgId}/docs/${docId}/docAcks/${docAckId}`).delete();
  }

  addDocAckToDoc(orgId: string, docId: string, docAckId: string) {
    return this.afs.doc(`org/${orgId}/docs/${docId}/docAcks/${docAckId}`).set({});
  }
}
