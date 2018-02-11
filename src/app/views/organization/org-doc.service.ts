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


  deleteOrgDocAckP(orgId: string, docAckId: string) {
    this.afs.collection(`org/${orgId}/users`).valueChanges()
      .take(1)
      .subscribe(orgUsers => {
        console.log(orgUsers);
        orgUsers.map((orgUser: any) => {
          console.log(orgUser);
          console.log(`org/${orgId}/users/${orgUser.uid}/docsAcks/${docAckId}`);
          this.afs.doc(`org/${orgId}/users/${orgUser.uid}/docsAcks/${docAckId}`)
            .delete();
        });
      });

    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`).delete();
  }

  getOrgUsersDocAck$(orgId: string, docAckId: string): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/users`)
      .map(resArray => {
        resArray.forEach(res => {
          this.afs.doc(`users/${res.id}`).valueChanges()
            // .take(1)
            .subscribe((userData: any) => {
              res.displayName = userData.displayName;
              res.photoURL = userData.photoURL;
              this.afs.doc(`org/${orgId}/users/${res.id}/docsAcks/${docAckId}`).valueChanges()
                // .take(1)
                .subscribe((userSignature: any) => {
                  if (userSignature) {
                    res.isRequired = userSignature.isRequired ? userSignature.isRequired : false;
                    res.hasSigned = userSignature.hasSigned ? userSignature.hasSigned : false;
                    res.signedAt = userSignature.signedAt;
                  } else {
                    res.isRequired = false;
                    res.hasSigned = false;
                  }
                });
            });
        });
        return resArray;
      });
  }

  getOrgPublishedDocs$(orgId): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/docs`)
      .map(docsArray => {
       const  res: Array<any> = new Array<any>();
       docsArray.map(doc => {
         if (doc.isPublish) {
           res.push(doc);
         }
       });
       return res;
      });
  }

  addOrgUserReqDocAck(orgId: string, docAckId: string, uid: string): Promise<any> {
    const updateOrUserisRequired = this.firestoreService.upsert(`org/${orgId}/users/${uid}/docsAcks/${docAckId}`, {
      isRequired: true
    });
    const updateDocsAcksField =  this.updateDocsAcksFieldP(orgId, docAckId, 'requiredSignatures', 'inc');

    return Promise.all([updateDocsAcksField, updateOrUserisRequired])
      .catch(err => console.log(err));
  }

  removeOrgUserReqDocAck(orgId: string, docAckId: string, uid: string): Promise<any> {
    const updateOrUserisRequired = this.firestoreService.upsert(`org/${orgId}/users/${uid}/docsAcks/${docAckId}`, {
      isRequired: false
    });
    const updateDocsAcksField = this.updateDocsAcksFieldP(orgId, docAckId, 'requiredSignatures', 'dec');

    return Promise.all([updateDocsAcksField, updateOrUserisRequired])
      .catch(err => console.log(err));
  }

  userDocAckSign(orgId: string, docAckId: string, uid: string): Promise<any> {
    const timestamp = this.firestoreService.timestamp;
    const updateOrUserHasSigned = this.firestoreService.upsert(`org/${orgId}/users/${uid}/docsAcks/${docAckId}`, {
      hasSigned: true,
      signedAt: timestamp
    });
    const updateDocsAcksField = this.updateDocsAcksFieldP(orgId, docAckId, 'actualSignatures', 'inc');

    return Promise.all([updateOrUserHasSigned, updateDocsAcksField])
      .catch(err => console.log(err));
  }

  getOrgDocAck$(orgId: string, docAckId: string): Observable<any> {
    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`).valueChanges();
  }

  getDocNameP(orgId: string, docId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.afs.doc(`org/${orgId}/docs/${docId}`).valueChanges()
        .take(1)
        .subscribe((doc: any) => {
          resolve(doc.name);
        });
    });
  }

  setDocAckData(orgId: string, docAckId: string, data ): Promise<any> {
    return this.afs.doc(`org/${orgId}/docsAcks/${docAckId}`)
      .update(data);
  }

  createNewDocAck(orgId: string, data): Promise<any> {
    return this.afs.collection(`org/${orgId}/docsAcks`).add(data);
  }

  updateReadAck(orgId: string, readAckId: string, data) {
    return this.firestoreService.upsert(`org/${orgId}/docsAcks/${readAckId}`, data);
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
