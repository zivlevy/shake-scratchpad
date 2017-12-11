import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../../core/auth.service';
import {OrgUser} from '../../../model/org-user';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'sk-org-admin',
  templateUrl: './org-admin.component.html',
  styleUrls: ['./org-admin.component.scss']
})
export class OrgAdminComponent implements OnInit, OnDestroy {
  currentUser: OrgUser;
  users: any;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public auth: AuthService,
              public orgService: OrgService,
              public router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {

    this.orgService.getOrgUser$()
      .takeUntil(this.destroy$)
      .subscribe(orgUser => {
        this.currentUser = orgUser;
        console.log(this.currentUser);
      });

    this.users = this.orgService.getOrgUsersList$();
  }

  userChanged(user) {
    console.log(user);
    this.orgService.updateOrgUser(user.uid, user)
      .then (() => {
        this.toastr.success('User updated successfully', '', {
          timeOut: 5000
        });
      })
      .catch (err => {
        this.toastr.error(err.message, '', {
          timeOut: 5000
        });
      });
  }

  userDeleted(userId){
    this.orgService.deleteOrgUser(userId)
      .then (() => {
        this.toastr.success('User deleted successfully', '', {
          timeOut: 5000
        });
      })
      .catch (err => {
        this.toastr.error(err.message, '', {
          timeOut: 5000
        });
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
