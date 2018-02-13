import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../core/auth.service';
import {ToastrService} from 'ngx-toastr';
import {LanguageService} from '../../core/language.service';

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

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public router: Router,
              private route: ActivatedRoute,
              private lngService: LanguageService,
              private toastr: ToastrService) {

  }

  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {

      this.returnRoute = params.get('returnUrl');
      if (params.get('name')) {
        this.requestName = params.get('name').replace('+', ' ');
      }
      this.requestEmail = params.get('mail');
      if (this.requestEmail) {
        this.emailBlocked = true;
      }
      console.log(this.returnRoute, this.requestEmail, this.requestName, this.emailBlocked);
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

  // Using getters will make your code look pretty
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  login() {
    this.auth.login(this.email.value, this.password.value).then(user => {
      this.router.navigate([this.returnRoute ? this.returnRoute : '']);
      window.location.reload();
    })
      .catch(err => {
        this.toastr.error(err.message, '', {
          timeOut: 5000,
        });
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
      }      // this.router.navigate([`${this.returnRoute}/register`], {queryParams: {returnUrl: this.returnRoute}});
      const orgId = this.router.routerState.snapshot.url.match('org/(.*)/')[1];
      this.router.navigate(['org/' + orgId + `/register`], {queryParams: queryParams});
    } else {
      this.router.navigate(['register']);
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
