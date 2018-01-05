import {Component, OnDestroy, OnInit} from '@angular/core';
import {CropperSettings} from 'ng2-img-cropper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LanguageService} from '../../../core/language.service';
import {OrgService} from '../org.service';
import {ImageService} from '../../../core/image.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import * as _ from "lodash";


@Component({
  selector: 'sk-org-admin-org',
  templateUrl: './org-admin-org.component.html',
  styleUrls: ['./org-admin-org.component.scss']
})
export class OrgAdminOrgComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  orgManagementForm: FormGroup;
  logoCropperSettings: CropperSettings;
  bannerCropperSettings: CropperSettings;
  inLogoEdit = false;
  inBannerEdit = false;
  logoData: any;
  bannerData: any;
  tempData: any;

  orgName: string;
  orgId: string;
  logoUrl: string;
  bannerUrl: string;
  orgHome: string;

  constructor(private fb: FormBuilder,
              private orgService: OrgService,
              private lngService: LanguageService,
              private imageService: ImageService,
              private router: Router) {

    this.logoCropperSettings = new CropperSettings();
    this.logoCropperSettings.width = 50;
    this.logoCropperSettings.height = 50;
    this.logoCropperSettings.croppedWidth = 50;
    this.logoCropperSettings.croppedHeight = 50;
    this.logoCropperSettings.canvasWidth = 350;
    this.logoCropperSettings.canvasHeight = 300;
    this.logoCropperSettings.rounded = false;

    this.bannerCropperSettings = new CropperSettings();
    this.bannerCropperSettings.width = 1000;
    this.bannerCropperSettings.height = 100;
    this.bannerCropperSettings.croppedWidth = 1000;
    this.bannerCropperSettings.croppedHeight = 100;
    this.bannerCropperSettings.canvasWidth = 1000;
    this.bannerCropperSettings.canvasHeight = 100;
    this.bannerCropperSettings.rounded = false;

    this.logoData = {};
    this.bannerData = {};
    this.tempData = {};
  }

  ngOnInit() {
    this.orgManagementForm = this.fb.group({
      'orgId': [{
        value: this.orgId,
        disabled: true
      }, [
        Validators.required
      ]],
      'orgName': ['', [
        Validators.required
      ]],
      'language': ['', [
        Validators.required
      ]]
    });

    // default logo
    this.logoUrl = 'assets/img/shake-logo/logo_no_text.svg';
    this.bannerUrl = 'assets/img/shake banner.png';
    // get current org
    this.orgService.getOrgPublicData$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        if (org) {
          this.orgName = org.orgName;
          this.orgId = org.orgId;
          this.orgHome = '/org/' + org.orgId;


          // get Logo
        this.imageService.getOrgLogo$(this.orgId)
          .subscribe(
            (url) => {
              this.logoUrl = url;
            },
            (err) => console.log('Error: ' + err));

        // get banner
        this.imageService.getOrgBanner$(this.orgId)
          .subscribe(
            (url) => {
              this.bannerUrl = url;
            },
            (err) => console.log('Error: ' + err));

      }}) ;


  }

  logoUploadClicked() {
    this.tempData = _.cloneDeep(this.logoData);
    this.inLogoEdit = true;
  }

  logoSavedClicked() {
    this.inLogoEdit = false;
  }

  logoCancelClicked() {
    this.logoData = _.cloneDeep(this.tempData);
    this.inLogoEdit = false;
  }

  bannerUploadClicked() {
    this.tempData = _.cloneDeep(this.bannerData);
    this.inBannerEdit = true;
  }

  bannerSaveClicked() {
    this.inBannerEdit = false;
  }

  bannerCancelClicked() {
    this.bannerData = _.cloneDeep(this.tempData);
    this.inBannerEdit = false;
  }

  saveClicked() {
    let publicDataPromise: any;
    let logoPromise: any;
    let bannerPromise: any;

    if (this.orgManagementForm.controls['orgName'].dirty) {
      const newData = {
        'orgName': this.orgManagementForm.controls['orgName'].value,
      };
      publicDataPromise = this.orgService.setOrgPublicData(this.orgId, newData);
    } else {
      publicDataPromise = Promise.resolve();
    }


    if (this.logoData.image) {
      logoPromise = this.imageService.uploadOrgLogo(this.logoData.image, this.orgId);
    } else {
      logoPromise = Promise.resolve();

    }

    if (this.bannerData.image) {
      bannerPromise = this.imageService.uploadOrgBanner(this.bannerData.image, this.orgId);
    } else {
      bannerPromise = Promise.resolve();
    }


    Promise.all([publicDataPromise, logoPromise, bannerPromise])
      .then(() => {
        console.log('all is well');
        this.router.navigate([this.orgHome]);
      })
      .catch(err => console.log(err));

  }

  cancelClicked() {
    this.router.navigate([this.orgHome]);
  }

  languageSelectorClicked(lang: string) {
    if (lang === 'English') {
      this.setLng('en');
    } else {
      this.setLng('he');
    }
  }

  setLng(lng) {
    this.lngService.setLanguadge(lng);
    if (lng === 'en') {
      this.orgManagementForm.controls['language'].setValue('English');
    } else {
      this.orgManagementForm.controls['language'].setValue('Hebrew');
    }
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
