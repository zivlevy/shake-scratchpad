import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {HomeService} from '../home.service';
import {LanguageService} from '../../../core/language.service';

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
  country: string;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public router: Router,
              private lngService: LanguageService,
              private homeService: HomeService) {

  }


  ngOnInit() {
    this.newOrgForm = this.fb.group({
      'orgId': ['', [
        Validators.required,
        Validators.pattern('[A-Za-z]{4,12}')
      ]
      ],
      'orgName': ['', [
        Validators.required
      ]
      ],
      'country': ['', [
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

  countryChanged(country: string) {
    this.country = country;
    this.updateSectors(country);
  }

  updateSector(sector: string) {
    console.log(this.country);
    this.sector = sector;
  }

  updateSectors(country: string) {
    this.sectors = new Array<string>();
    this.homeService.getCountrySectors$(country)
      .take(1)
      .subscribe(sectorsList => {
        for (const sector of sectorsList) {
          this.sectors.push(sector.id);
        }
        this.newOrgForm.controls['sector'].setValue('');
      });
  }

  addOrg() {
    this.homeService.setNewOrg(this.orgId.value, this.orgName.value, this.country, this.sector)
      .then(() => {
        this.router.navigate([`org/${this.orgId.value}`]);
      });
  }

  setLng(lng) {
    this.lngService.setLanguadge(lng);
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

  test() {
    this.homeService.test();
  }
}
