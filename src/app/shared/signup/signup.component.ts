import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../core/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LanguageService} from '../../core/language.service';

@Component({
  selector: 'sk-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private toastr: ToastrService) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      console.log(params.get('returnUrl'));
      this.returnRoute = params.get('returnUrl');
    });


    this.loginForm = this.fb.group({
      'displayName': ['', [
        Validators.required,
      ]
      ],
      'email': ['', [
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
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get displayName() {
    return this.loginForm.get('displayName');
  }

  get confirmPassword() {
    return this.loginForm.get('confirmPassword');
  }


  signup() {
    this.auth.emailSignUp(this.email.value, this.password.value).then(user => {
      console.log(user);
      user.sendEmailVerification();
      this.auth.createUserInitialData(user.uid, this.email.value , this.displayName.value, );
      this.router.navigate([this.returnRoute ? this.returnRoute : '']);

    }).catch(err => {
      this.toastr.error(err.message, '', {
        timeOut: 5000,
      });
    });

  }

  gotoLogin() {

    if (this.returnRoute) {
      // this.router.navigate([`${this.returnRoute}/login`], {queryParams: {returnUrl: this.returnRoute}});
      const orgId = this.router.routerState.snapshot.url.match('org/(.*)/')[1];
      this.router.navigate(['org/' + orgId + '/login'], {queryParams: {returnUrl: this.returnRoute}});
    } else {
      this.router.navigate(['login']);
    }
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
