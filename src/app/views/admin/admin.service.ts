import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import {AuthService} from '../../core/auth.service';
import {Observable} from 'rxjs';
import {FirestoreService} from '../../core/firestore.service';
import {ImageService} from '../../core/image.service';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class AdminService {

  constructor(private authService: AuthService,
              private firestoreService: FirestoreService,
              private afs: AngularFirestore,
              private imageService: ImageService) {
  }

  getOrgs$(): Observable<any> {

    const orgsRef: AngularFirestoreCollection<any> = this.afs.collection<any>('org');

    return orgsRef.snapshotChanges()
      .pipe(
        switchMap((result: Array<any>) => {
          return Observable.forkJoin(
            result.map(org => {
              const orgsRefInfo: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${org.payload.doc.id}/publicData/info`);
              return orgsRefInfo.valueChanges().take(1);
            }));
        }));
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
          const orgDelete = this.afs.collection('org').doc(orgId).delete();
          const logoDelete = this.imageService.deleteOrgLogoP(orgId);
          const bannerDelete = this.imageService.deleteOrgBannerP(orgId);

          return Promise.all([orgDelete, logoDelete, bannerDelete])
            .catch(err => console.log(err));
        }
      );
  }

  deleteOrgRefs(orgId: string) {
    return new Promise((resolve, reject) => {

      const deleteArray = [];

      this.firestoreService.colWithIds$(`org/${orgId}/users`)
        .take(1)
        .subscribe(users => {
          users.forEach(user => {
            deleteArray.push(this.afs.collection('users').doc(user.id).collection('orgs').doc(orgId).delete());
          });
          Promise.all(deleteArray)
            .then(() => resolve())
            .catch(err => reject(err));
        });
    });
  }

}
