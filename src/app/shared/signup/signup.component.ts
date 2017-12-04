import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'sk-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    name: string;
    password: string;
    email: string;
    showSpinner = false;
    returnUrl: string;
    constructor(private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.route.snapshot.queryParams);
    }

    signup() {
        this.showSpinner = true;
        this.authService.emailSignUp(this.email, this.password)
            .then(user => {
                this.showSpinner = false;
                this.router.navigate([this.returnUrl]);
            }).catch(err =>  this.showSpinner = true);
    }

}
