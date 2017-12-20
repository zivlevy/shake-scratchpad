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


  uploadUserImg(upload: Upload, userId: string){
  const storageRef = firebase.storage().ref();
    const uploadTask = storageRef.child(`${this.basePath}/${userId}`).put(upload.file);
    return uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL;
        upload.name = upload.file.name;
        console.log('finished');
        this.authService.updateUserProfile(null, uploadTask.snapshot.downloadURL)

      }
    );
  }

  // Writes the file details to the realtime db
//   private saveFileData(upload: Upload) {
//     this.db.list(`${this.basePath}/`).push(upload);
//   }
}
