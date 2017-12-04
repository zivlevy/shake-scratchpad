import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../core/auth.service';

@Component({
    selector: 'sk-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    password: string;
    email: string;
    showSpinner = false;
    returnUrl: string;

    constructor(private authService: AuthService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.showSpinner = true;
        this.authService.login(this.email, this.password)
            .then(user => {
                this.showSpinner = false;
                this.router.navigate([this.returnUrl]);
            })
            .catch(err => this.showSpinner = false);
    }

}
