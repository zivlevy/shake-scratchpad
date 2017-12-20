import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../../organization/org.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
        // Validators.required
      ]],
      'sector': [ '', [
        // Validators.required
      ]]
    });

  }

  // Using getters will make your code look pretty
  get orgId() {
    return this.newOrgForm.get('orgId');
  }

  addOrg() {
    console.log(this.orgId.value);
    this.homeService.setNewOrg(this.orgId.value)
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
}