import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {HomeService} from '../home.service';
import {LanguageService} from '../../../core/language.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DataPackageService} from "../../../core/data-package.service";
import {ImageService} from "../../../core/image.service";
import {OrgService} from "../../organization/org.service";

@Component({
  selector: 'sk-add-org',
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.scss']
})
export class AddOrgComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  newOrgForm: FormGroup;
  sectors: Array<string>;
  sector: string;
  language: string;
  orgIdAvailable: boolean;
  isWaiting: boolean = false;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public router: Router,
              private lngService: LanguageService,
              private homeService: HomeService,
              private dataPackageService: DataPackageService,
              private imageService: ImageService,
              private orgService: OrgService,
              private spinner: NgxSpinnerService) {
    this.orgIdAvailable = false;
  }


  ngOnInit() {

    this.newOrgForm = this.fb.group({
      'orgId': ['', [
        Validators.required,
        Validators.pattern('[A-Za-z0-9]{4,12}'),
        this.validateOrgId.bind(this)
      ]
      ],
      'orgName': ['', [
        Validators.required
      ]
      ],
      'language': ['', [
        Validators.required
      ]],
      'sector': [ '', [
        Validators.required
      ]]
    });

    this.updateSectors('Israel');
  }

  get orgId() {
    return this.newOrgForm.get('orgId');
  }

  get orgName() {
    return this.newOrgForm.get('orgName');
  }

  languageChanged(language) {
    this.language = language;
    this.updateSectors(language);
  }

  updateSector(sector: string) {
    console.log(this.language);
    this.sector = sector;
  }

  updateSectors(language: string) {
    this.sectors = new Array<string>();
    this.homeService.getLanguageSectors$(language)
      .take(1)
      .subscribe(sectorsList => {
        for (const sector of sectorsList) {
          this.sectors.push(sector.id);
        }
        this.newOrgForm.controls['sector'].setValue('');
      });
  }

  addOrg() {

    this.spinner.show();
    this.isWaiting = true;

    const newOrgP = this.homeService.setNewOrg(this.orgId.value, this.orgName.value, this.language, this.sector);
    const imageUrlP = this.dataPackageService.getDataPackageImagesUrl(this.language, this.sector);

    Promise.all([newOrgP, imageUrlP])
      .then((res) => {
        const imagesUrls = res[1];
        console.log(imagesUrls);
        this.homeService.waitForOrg(this.orgId.value)
          .takeUntil(this.destroy$)
          .subscribe(res1 => {
            console.log(res1);
            if (res1 && res1.orgId) {
              console.log(this.orgId, imagesUrls);
              this.orgService.setOrgPublicData(res1.orgId, imagesUrls)
                .then(() => {
                  this.spinner.hide();
                  this.isWaiting = false;
                  this.router.navigate([`org/${this.orgId.value}`]);
                })
                .catch(err => console.log(err));
            }
          });
      });
  }



  setLng(lng) {
    this.lngService.setLanguadge(lng);
  }

  checkOrgId() {
    this.orgIdAvailable = false;
    if (this.orgId.value.length === 0) {
      this.orgIdAvailable = true;
      return;
    }
    this.homeService.orgIdExists$(this.orgId.value)
      .take(1)
      .subscribe(exists => {
        this.orgIdAvailable = !exists;
        this.newOrgForm.controls['orgId'].updateValueAndValidity();
      });
  }

  validateOrgId(c: FormControl) {
    return this.orgIdAvailable ? null : {err: true};
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
