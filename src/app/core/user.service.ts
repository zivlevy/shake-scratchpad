import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {FirestoreService} from './firestore.service';

@Injectable()
export class UserService {

  constructor(private firestoreService: FirestoreService
  ) { }

  getUserOrgs$ (uid: string): Observable<any> {
    return this.firestoreService.colWithIds$(`users/${uid}/orgs`);
  }
}
