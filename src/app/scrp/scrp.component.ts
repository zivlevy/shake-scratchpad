import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ImageService} from '../core/image.service';
import {Upload} from '../model/upload';
import {AuthService} from '../core/auth.service';
import { CropperSettings} from 'ng2-img-cropper';

@Component({
  selector: 'sk-scrp',
  templateUrl: './scrp.component.html',
  styleUrls: ['./scrp.component.scss'],

})
export class ScrpComponent implements OnInit {
  selectedFiles: FileList;
  currentUpload: Upload;
  currentUser;
  gravatar;
  data: any;
  cropperSettings: CropperSettings;

  isEditImage = false;

  constructor( private upSvc: ImageService,
               authService: AuthService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 100;
    this.cropperSettings.croppedHeight = 100;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;

    this.data = {};


    authService.getUser$().subscribe(user => this.currentUser = user);

  }

  ngOnInit() {
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  ValidateSize(file) {
    const FileSize = file.files[0].size / 1024 / 1024; // in MB
    console.log(FileSize);
    if (FileSize > 0.3) {
      alert('File size exceeds 2 MB');
      // $(file).val(''); //for clearing with Jquery
    } else {

    }
  }
  uploadSingle() {
    const file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    const uploadTask = this.upSvc.uploadUserImg(this.currentUpload, this.currentUser.uid);

  }


}
