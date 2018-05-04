import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {LanguageService} from '../../core/language.service';
import {ToasterService} from '../../core/toaster.service';
import {OrgService} from '../../views/organization/org.service';

@Component({
  selector: 'sk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;
  requestName: string;
  requestEmail: string;
  emailBlocked = false;
  orgId: string;

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private orgService: OrgService,
              private toaster: ToasterService) {
  }

  ngOnInit() {

    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => {
        this.orgId = org;
      });

    this.route.queryParamMap.subscribe(params => {

      this.returnRoute = params.get('returnUrl');
      if (params.get('name')) {
        this.requestName = params.get('name').replace('+', ' ');
      }
      this.requestEmail = params.get('mail');
      if (this.requestEmail) {
        this.emailBlocked = true;
      }
    });


    this.loginForm = this.fb.group({
      'email': [{
        value: this.requestEmail,
        disabled: this.emailBlocked
      },  [
        Validators.required,
        Validators.email
      ]
      ],
      'password': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25),
        Validators.required
      ]
      ]
    });

  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  login() {
    this.auth.login(this.email.value, this.password.value).then(() => {

      let queryParams;
      if (this.returnRoute) {
        if (this.requestEmail) {
          queryParams = {
            name: this.requestName,
            mail: this.requestEmail
          };
          this.router.navigate([this.returnRoute], {queryParams: queryParams})
            .catch(err => console.log(err));
        } else {
          this.router.navigate([this.returnRoute])
            .catch(err => console.log(err));
        }
      } else {
        this.router.navigate([''])
          .catch(err => console.log(err));
        window.location.reload();
      }
    })
      .catch(err => {
        if (err.code === 'auth/user-not-found') {
          this.toaster.toastError('User not Found');
        } else {
          this.toaster.toastError(err.message);
        }
      });

  }

  gotoRegister() {
    let queryParams;

    if (this.returnRoute) {
      if (this.requestEmail) {
        queryParams = {
          returnUrl: this.returnRoute,
          name: this.requestName,
          mail: this.requestEmail
        };
      } else {
        queryParams = {
          returnUrl: this.returnRoute
        };
      }
      this.router.navigate(['org/' + this.orgId + `/register`], {queryParams: queryParams})
        .catch(err => console.log(err));
    } else {
      this.router.navigate(['register'])
        .catch(err => console.log(err));
    }
  }

  setLng(lng) {
    this.lngService.setLanguadge(lng);
  }

  resetPassword() {
    this.auth.resetPassword(this.email.value)
      .then(() => this.toaster.toastSuccess('Password reset mail sent'));
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
