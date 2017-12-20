import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Upload} from '../model/upload';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {AuthService} from './auth.service';

@Injectable()
export class UploadService {
  currentUser;

  constructor(private afs: AngularFirestore,
              private authService: AuthService) {

    authService.getUser$().subscribe(user => {
      if (user) {
        this.currentUser = user;
      }
    });
  }

  private basePath = '/uploads';


  uploadUserImg(img, userId: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${userId}`)
      .putString(img, 'data_url', {contentType: 'image/png'}).then((snapshot) => {
      this.authService.updateUserProfile(null, snapshot.downloadURL);
    }).catch(err => console.log(err));
  }
}
