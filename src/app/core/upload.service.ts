import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {AuthService} from './auth.service';


@Injectable()
export class UploadService {
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

  getOrgLogo(orgId: string) {
    const storageRef = firebase.storage().ref();
    return storageRef
      .child(`${this.orgImagePath}/${orgId}/logo`)
      .getDownloadURL();

    // console.log('promise started');
    // return new Promise <string>((resolve, reject) => {
    //   const storageRef = firebase.storage().ref();
    //   storageRef
    //     .child(`${this.orgImagePath}/${orgId}/logo`)
    //     .getDownloadURL()
    //     .then((url) => {
    //       resolve(url);
    //     })
    //     .catch(err => {
    //       console.log('service error', err);
    //       reject(err);
    //     });
    // });
  }
}
