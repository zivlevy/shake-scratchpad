import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LanguageService} from '../../core/language.service';
import {CropperSettings} from 'ng2-img-cropper';
import {Upload} from '../../model/upload';
import {UploadService} from '../../core/upload.service';


@Component({
  selector: 'sk-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  currentAuthUser;
  currentSkUser;
  newDisplayName = '';
  newEmail = '';

  cropperSettings: CropperSettings;
  isEditImage = false;
  isEditEmail = false;
  data: any;
  tmpDataImage: string;

  selectedFiles: FileList;
  currentUpload: Upload;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(public fb: FormBuilder,
              public authService: AuthService,
              private uploadService: UploadService,
              private router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private toastr: ToastrService) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 250;
    this.cropperSettings.croppedHeight = 250;
    this.cropperSettings.canvasWidth = 350;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;

    this.data = {};


  }

  ngOnInit() {
    this.authService.getSkUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.data.image = user.photoURL;
        this.currentSkUser = user;
        this.newDisplayName = user.displayName;
      });

    this.authService.getUser$()
      .takeUntil(this.destroy$)
      .subscribe(user => {
        this.currentAuthUser = user;
        this.newEmail = user.email;
      });
  }

  updateDisplayName() {
    this.authService.updateUserProfile( this.currentAuthUser.uid, this.newDisplayName, null)
      .then(user => console.log(user))
      .catch();
  }

  updateEmail() {
    this.authService.updateUserEmail(this.newEmail)
      .then(() => {
        this.isEditEmail = false;
        this.currentAuthUser.sendEmailVerification();
      })
      .catch();
  }

  cancelEmailUpdate() {
    this.isEditEmail = false;
  }

  uploadSingle() {
    this.uploadService.uploadUserImg(this.data.image, this.currentSkUser.uid)
      .then(() => {
        this.isEditImage = false;
        console.log('finishhhhh')
      });
  }


  showEmailEdit() {
    this.isEditEmail = true;
    this.newEmail = this.currentAuthUser.email;
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
