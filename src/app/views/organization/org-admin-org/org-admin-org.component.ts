import { Component, OnInit } from '@angular/core';
import {CropperSettings} from "ng2-img-cropper";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LanguageService} from "../../../core/language.service";
import {OrgService} from "../org.service";

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

  constructor(private fb: FormBuilder,
              private orgService: OrgService,
              private lngService: LanguageService) {

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

    // get current org
    this.orgService.getOrgPublicData$()
      .take(1)
      .subscribe(org => {
        this.orgName = org.orgName;
        this.orgId = org.orgId;
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
