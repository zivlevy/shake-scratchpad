import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AuthService} from '../../core/auth.service';
import {LanguageService} from '../../core/language.service';
import {ToasterService} from '../../core/toaster.service';
import {takeUntil} from 'rxjs/operators';
import {OrgService} from '../../views/organization/org.service';

@Component({
  selector: 'sk-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;
  requestName: string;
  requestEmail: string;
  emailBlocked = false;
  homeRoute: string;
  orgId: string;

  constructor(public fb: FormBuilder,
              public authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private orgService: OrgService,
              private toaster: ToasterService) {

  }

  ngOnInit() {

    // get current org
    this.orgService.getCurrentOrg$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => {
        this.orgId = org;
        if (org) {
          this.homeRoute = 'org/' + org;
        } else {
          this.homeRoute = '';
        }
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


    this.signupForm = this.fb.group({
      'displayName': [this.requestName, [
        Validators.required,
      ]
      ],
      'email': [{
        value: this.requestEmail,
        disabled: this.emailBlocked
      }, [
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
    ],
      'confirmPassword': ['', [

    ]
    ]
    }, { validator: this.checkPasswords});

  }


  // validator
  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }


  // Using getters will make your code look pretty
  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

  get displayName() {
    return this.signupForm.get('displayName');
  }

  signup() {
    this.authService.emailSignUp(this.email.value, this.password.value).then((user) => {
      this.authService.sendEmailVerification(user.user, this.homeRoute)
        .catch(err => console.log(err));
      this.authService.createUserInitialData(user.user.uid, this.email.value , this.displayName.value, )
        .catch(err => console.log(err));

      this.router.navigate([this.homeRoute])
        .catch(err => console.log(err));

    }).catch(err => {
      this.toaster.toastError(err.message);
    });

  }

  gotoLogin() {
    let queryParams;
    queryParams = {
      returnUrl: this.returnRoute,
      name: this.requestName,
      mail: this.requestEmail
    };
    this.router.navigate([this.homeRoute + '/login'], {queryParams: queryParams})
        .catch(err => console.log(err));

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
