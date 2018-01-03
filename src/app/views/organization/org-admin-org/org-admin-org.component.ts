import { Component, OnInit } from '@angular/core';
import {CropperSettings} from "ng2-img-cropper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageService} from "../../../core/language.service";
import {OrgService} from "../org.service";
import {UploadService} from "../../../core/upload.service";

@Component({
  selector: 'sk-org-admin-org',
  templateUrl: './org-admin-org.component.html',
  styleUrls: ['./org-admin-org.component.scss']
})
export class OrgAdminOrgComponent implements OnInit {

  orgManagementForm: FormGroup;
  logoCropperSettings: CropperSettings;
  bgImgCropperSettings: CropperSettings;
  inLogoEdit = false;
  inBGImageEdit = false;
  logoData: any;
  imgData: any;

  orgName: string;
  orgId: string;
  logoUrl: string;

  constructor(private fb: FormBuilder,
              private orgService: OrgService,
              private lngService: LanguageService,
              private uploadService: UploadService) {

    this.logoCropperSettings = new CropperSettings();
    this.logoCropperSettings.width = 50;
    this.logoCropperSettings.height = 50;
    this.logoCropperSettings.croppedWidth = 50;
    this.logoCropperSettings.croppedHeight = 50;
    this.logoCropperSettings.canvasWidth = 350;
    this.logoCropperSettings.canvasHeight = 300;
    this.logoCropperSettings.rounded = false;

    this.bgImgCropperSettings = new CropperSettings();
    this.bgImgCropperSettings.width = 200;
    this.bgImgCropperSettings.height = 100;
    this.bgImgCropperSettings.croppedWidth = 500;
    this.bgImgCropperSettings.croppedHeight = 250;
    this.bgImgCropperSettings.canvasWidth = 700;
    this.bgImgCropperSettings.canvasHeight = 300;
    this.bgImgCropperSettings.rounded = false;

    this.logoData = {};
    this.imgData = {};
  }

  ngOnInit() {
    this.orgManagementForm = this.fb.group({
      'orgId': [{
        values: this.orgId,
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

    // get current org
    this.orgService.getOrgPublicData$()
      .take(1)
      .subscribe(org => {
        this.orgName = org.orgName;
        this.orgId = org.orgId;

        // get Logo
        this.uploadService.getOrgLogo$(this.orgId)
          .subscribe(
            (url) => {
              this.logoUrl = url;
            },
            (err) => console.log('Error: ' + err),
            () => console.log('Completed'));
      });


  }

  logoUploadClicked() {
    this.inLogoEdit = true;
  }

  logoSavedClicked() {
    this.inLogoEdit = false;
  }

  imageUploadClicked() {
    this.inBGImageEdit = true;
  }

  imageSaveClicked() {
    this.inBGImageEdit = false;
  }

  saveClicked() {
    this.uploadService.uploadOrgLogo(this.logoData.image, this.orgId)
      .then()
      .catch();
  }

  cancelClicked() {

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

}
