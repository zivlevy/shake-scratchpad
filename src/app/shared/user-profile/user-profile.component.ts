import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {CropperSettings} from 'ng2-img-cropper';
import {ImageService} from '../../core/image.service';
import {ToasterService} from '../../core/toaster.service';
import {takeUntil} from 'rxjs/operators';
import {EmailService} from '../../core/email.service';


@Component({
  selector: 'sk-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
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

  displayName: string;
  email: string;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private authService: AuthService,
              private imageService: ImageService,
              private toaster: ToasterService,
              private emailService: EmailService
              ) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 250;
    this.cropperSettings.croppedHeight = 250;
    this.cropperSettings.canvasWidth = 300;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.rounded = true;

    this.data = {};


  }

  ngOnInit() {
    this.authService.getSkUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.data.image = user.photoURL;
        this.currentSkUser = user;
        this.newDisplayName = user.displayName;
        this.displayName = user.displayName;

      });

    this.authService.getUser$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentAuthUser = user;
        this.newEmail = user.email;
        this.email = user.email;
      });
  }


  displayNameUpdateClicked() {
    this.authService.updateUserProfile( this.currentAuthUser.uid, this.displayName, null)
      .then(user => console.log(user))
      .catch(err => console.log(err));
  }

  displayNameUpdateCanceled() {
    this.displayName = this.currentSkUser.displayName;
  }

  emailUpdateClicked() {
    this.authService.updateUserEmail(this.email)
      .then(() => {
        this.isEditEmail = false;
        this.currentAuthUser.sendEmailVerification()
          .catch(err => console.log(err));
      })
      .then(() => {
        this.currentAuthUser.email = this.email;
      })
      .catch(err => {
        if (err.code === 'auth/requires-recent-login') {
          this.toaster.toastError('This operation requires recent login. Please logout and the login again');
          this.email = this.currentAuthUser.email;
        }
        console.log(err.code);
      });
  }

  emailUpdateCanceled() {
    this.email = this.currentAuthUser.email;
  }

  emailValidate(email: string): boolean {
    return this.emailService.isValidEmail(email);
    // const emailRegex = new RegExp('^([\\w\\!\\#$\\%\\&\\\'\\*\\+\\-\\/\\=\\?\\^\\`{\\|\\}\\~]+\\.)*[\\w\\!\\#$\\%\\&\\\'\\*\\+\\-\\/\\=\\?\\^\\`{\\|\\}\\~]+@((((([a-z0-9]{1}[a-z0-9\\-]{0,62}[a-z0-9]{1})|[a-z])\\.)+[a-z]{2,6})|(\\d{1,3}\\.){3}\\d{1,3}(\\:\\d{1,5})?)$');
    // return emailRegex.test(email.toLowerCase());
  }

  uploadSingle() {
    this.imageService.uploadUserImg(this.data.image, this.currentSkUser.uid)
      .then(() => {
        this.isEditImage = false;
      })
      .catch(err => console.log(err));
  }

  resetPassword() {
    this.authService.resetPassword(this.currentAuthUser.email)
      .then(() => this.toaster.toastSuccess('Password reset mail sent'));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
