import { Injectable } from '@angular/core';
import {AngularFirestore} from "angularfire2/firestore";
import {FirestoreService} from "../../core/firestore.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class OrgDocService {

  constructor(private afs: AngularFirestore,
              private firestoreService: FirestoreService,
              ) { }

  getOrgDocsAcks (orgId: string): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/docsAcks`);
  }
}
