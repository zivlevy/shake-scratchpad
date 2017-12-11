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
  detailForm: FormGroup;
  currentUser: OrgUser;
  currentOrg: string;
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

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.currentOrg = org;
      });

    this.detailForm = this.fb.group({
      'displayName': ['', [Validators.required]]
    });

  }

  get displayName() {
    return this.detailForm.get('displayName');
  }

  setUserDetails(user) {
    this.currentUser.displayName = this.displayName.value;
    const newUserData: OrgUser = {uid: this.currentUser.uid, displayName: this.displayName.value};
    this.orgService.updateOrgUser(this.currentUser.uid, newUserData)
      .then(() => {
        this.router.navigate([`org/${this.currentOrg}`]);
      });
  }

  ngOnDestroy() {
    console.log('unsub =======');
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
