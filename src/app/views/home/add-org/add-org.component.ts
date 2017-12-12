import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../../organization/org.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import {HomeService} from "../home.service";

@Component({
  selector: 'sk-add-org',
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.scss']
})
export class AddOrgComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  orgForm: FormGroup;


  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public router: Router,
              private homeService: HomeService) {

  }

  ngOnInit() {
    this.orgForm = this.fb.group({
      'orgname': ['', [
        Validators.required,
        Validators.pattern('[A-Za-z]{4,12}')
      ]
      ],
      'org-statement': ['', [
        Validators.required
      ]
      ]
    });

  }

  // Using getters will make your code look pretty
  get orgname() {
    return this.orgForm.get('orgname');
  }

  get password() {
    return this.orgForm.get('password');
  }

  addOrg() {
    console.log(this.orgname.value);
    this.homeService.setNewOrg(this.orgname.value)
      .then(() => {
        this.router.navigate([`org/${this.orgname.value}`]);
      });

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
