import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import 'firebase/storage';
import {AuthService} from './auth.service';

import { FirebaseApp } from 'angularfire2';


@Injectable()
export class ImageService {
  currentAuthUser;

  constructor(private afs: AngularFirestore,
              private authService: AuthService,
              private  fb: FirebaseApp) {

    authService.getUser$().subscribe(user => {
      if (user) {
        this.currentAuthUser = user;
      }
    });
  }

  private usersImagePath = '/users';
  private orgImagePath = '/orgs';


  uploadUserImg(img, userId: string) {
    return new Promise((resolve, reject) => {
      const storageRef = this.fb.storage().ref();
      storageRef.child(`${this.usersImagePath}/${userId}`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then(() => {
        storageRef.child(`${this.usersImagePath}/${userId}`).getDownloadURL()
          .then(url => {
            this.authService.updateUserProfile( this.currentAuthUser.uid, null,  url).then(() => {
              resolve();
            });
          });


      }).catch(err => reject(err));
    });
  }

  uploadOrgLogo(img, orgId: string) {
    return new Promise<string>((resolve, reject) => {
      const storageRef = this.fb.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}logo.png`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then(() => {
        storageRef.child(`${this.orgImagePath}/${orgId}logo.png`).getDownloadURL()
          .then(url => {
            resolve(url);
          });
      }).catch(err => reject(err));
    });
  }

  deleteOrgLogoP(orgId: string) {
    const storageRef = this.fb.storage().ref().child(`orgs/${orgId}logo.png`);
    return storageRef
      .getDownloadURL()             // used to test if file exists
      .then(() => {
        return storageRef.delete();
      })
      .catch((err) => {
        return Promise.resolve(err);
      });                     // File doesn't exist so the promise is resolved
  }

  deleteOrgBannerP(orgId: string) {
    const storageRef = this.fb.storage().ref().child(`orgs/${orgId}banner.png`);
    return storageRef
      .getDownloadURL()             // used to test if file exists
      .then(() => {
        return storageRef.delete();
      })
      .catch((err) => {
        return Promise.resolve;
      });                     // File doesn't exist so the promise is resolved
  }

  uploadOrgBanner(img, orgId: string) {
    return new Promise<string>((resolve, reject) => {
      const storageRef = this.fb.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}banner.png`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then(() => {
        storageRef.child(`${this.orgImagePath}/${orgId}banner.png`).getDownloadURL()
          .then(url => {
            resolve(url);
          });
      }).catch(err => reject(err));
    });
  }


  getDataPackageLogoUrl$(fileName: string) {
    return this.fb.storage().ref()
      .child(`dataPackages/logos/${fileName}`)
      .getDownloadURL();
  }

  getDataPackageBannerUrl$(fileName: string) {
    return this.fb.storage().ref()
      .child(`dataPackages/banners/${fileName}`)
      .getDownloadURL();
  }

}
