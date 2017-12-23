import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Upload} from '../model/upload';
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

  private basePath = '/uploads';


  uploadUserImg(img, userId: string) {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      storageRef.child(`${this.basePath}/${userId}`)
        .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
          console.log(snapshot)
        this.authService.updateUserProfile( this.currentAuthUser.uid, null,  snapshot.downloadURL).then(() => {
           resolve();
        });
      }).catch(err => reject(err));
    });
  }
}
