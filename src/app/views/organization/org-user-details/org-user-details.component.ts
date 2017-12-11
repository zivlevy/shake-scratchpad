import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import {Router} from '@angular/router';

@Component({
  selector: 'sk-org-user-details',
  templateUrl: './org-user-details.component.html',
  styleUrls: ['./org-user-details.component.scss']
})
export class OrgUserDetailsComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  detailForm: FormGroup;
  currentUser: OrgUser;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public orgService: OrgService,
              public router: Router) {

  }

  ngOnInit() {

    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(orgUser => {
        this.currentUser = orgUser;
        console.log(this.currentUser);
      });

    this.detailForm = this.fb.group({
      'displayName': ['', [Validators.required]]
    });

  }

  get displayName() {
    return this.detailForm.get('displayName');
  }

  // Step 2
  setUserDetails(user) {
    this.currentUser.displayName = this.displayName.value;
    return this.orgService.updateOrgUser(this.currentUser.uid, this.currentUser);
  }

  ngOnDestroy() {
    console.log('unsub =======');
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
