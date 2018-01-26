import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';


@Injectable()
export class ImageService {
  currentAuthUser;

  constructor(private afs: AngularFirestore,
              private authService: AuthService) {

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
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.usersImagePath}/${userId}`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
        console.log(snapshot);
        this.authService.updateUserProfile( this.currentAuthUser.uid, null,  snapshot.downloadURL).then(() => {
          resolve();
        });
      }).catch(err => reject(err));
    });
  }

  uploadOrgLogo(img, orgId: string) {
    return new Promise<string>((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}logo.png`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
        console.log(snapshot.downloadURL);
        resolve(snapshot.downloadURL);
      }).catch(err => reject(err));
    });
  }

  deleteOrgLogoP(orgId: string) {
    const storageRef = firebase.storage().ref().child(`orgs/${orgId}logo.png`);
    storageRef
      .getDownloadURL()             // used to test if file exists
      .then(() => {
        return storageRef.delete();
      })
      .catch((err) => {
        return Promise.resolve;
      });                     // File doesn't exist so the promise is resolved
  }

  deleteOrgBannerP(orgId: string) {
    const storageRef = firebase.storage().ref().child(`orgs/${orgId}banner.png`);
    storageRef
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
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}banner.png`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
        console.log(snapshot.downloadURL);
        resolve(snapshot.downloadURL);
      }).catch(err => reject(err));
    });
  }


  getDataPackageLogoUrl$(fileName: string) {
    return firebase.storage().ref()
      .child(`dataPackages/logos/${fileName}`)
      .getDownloadURL();
  }

  getDataPackageBannerUrl$(fileName: string) {
    return firebase.storage().ref()
      .child(`dataPackages/banners/${fileName}`)
      .getDownloadURL();
  }

}
