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
      // .map(docsAcks => {
      //   docsAcks.forEach(docAck => {
      //     this.afs.doc(`org/${orgId}/docs/${docAck.docId}`).valueChanges()
      //       .take(1)
      //       .subscribe((doc: any) => {
      //         docAck.docName = doc.name;
      //       });
      //   });
      //   return docsAcks;
      // });
  }


  deleteOrgDocAckP(orgId: string, docAckId: string) {
    this.afs.collection(`org/${orgId}/users`).valueChanges()
      .take(1)
      .subscribe(orgUsers => {
        orgUsers.map((orgUser: any) => {
          this.afs.doc(`org/${orgId}/users/${orgUser.uid}/docsAcks/${docAckId}`).delete()
            .catch(err => console.log(err));
        });
      });

    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`).delete();
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

  getDeActivateDocAckUsers$(orgId: string, docAckId: string): Observable<any> {

    return this.firestoreService.colWithIds$(`org/${orgId}/docsAcks/${docAckId}/users`)
      .map(resArray => {
        resArray.forEach(res => {
          this.afs.doc(`org/${orgId}/users/${res.id}`).valueChanges()
            .subscribe((userData: any) => {
              if (userData) {
                res.isRequired = true;
                res.displayName = userData.displayName;
                res.photoURL = userData.photoURL;
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

  createNewDocAck(orgId: string, data): Promise<any> {
    return this.afs.collection(`org/${orgId}/docsAcks`).add(data);
  }


}
