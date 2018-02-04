import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "angularfire2/firestore";
import {Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {AuthService} from '../../core/auth.service';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AdminService {

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private  afAuth: AngularFireAuth,
              private router: Router) { }

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
}
