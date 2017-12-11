import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {AuthService} from '../../core/auth.service';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'sk-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;

  constructor(public fb: FormBuilder,
              public auth: AuthService,
              public router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrService) {

  }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      console.log(params.get('returnUrl'))
      this.returnRoute = params.get('returnUrl');
    });


    this.loginForm = this.fb.group({
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
      this.router.navigate([this.returnRoute]);
    })
      .catch(err => {
        this.toastr.error(err.message, '',{
          timeOut: 5000,
        });
      });

  }
gotoRegister(){
    console.log(this.returnRoute)
    this.router.navigate(['register'], {queryParams: {returnUrl: this.returnRoute}});
}

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }

}
