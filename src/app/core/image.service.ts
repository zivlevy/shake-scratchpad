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
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}/logo`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
          console.log(snapshot.downloadURL);
          resolve();
        }).catch(err => reject(err));
    });
  }

  deleteOrgLogoP(orgId: string) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.orgImagePath}/${orgId}/logo`)
      .delete();
  }

  deleteOrgBannerP(orgId: string) {
    const storageRef = firebase.storage().ref();
    console.log('delete banner');
    return storageRef.child(`${this.orgImagePath}/${orgId}/banner`)
      .delete();
  }

  uploadOrgBanner(img, orgId: string) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.orgImagePath}/${orgId}/banner`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
        console.log(snapshot.downloadURL);
        resolve();
      }).catch(err => reject(err));
    });
  }

  getOrgLogo$(orgId: string) {
    const storageRef = firebase.storage().ref();
    return Observable.defer(() => {
      return storageRef
        .child(`${this.orgImagePath}/${orgId}/logo`)
        .getDownloadURL();
    })
      .retryWhen((err) => {
        return err
          .delay(2000)
          .take(5);
      });
  }

  getOrgBanner$(orgId: string) {
    const storageRef = firebase.storage().ref();
    return Observable.defer(() => {
      return storageRef
        .child(`${this.orgImagePath}/${orgId}/banner`)
        .getDownloadURL();
    })
      .retryWhen((err) => {
        return err
          .delay(2000)
          .take(5);
      });
  }
}
