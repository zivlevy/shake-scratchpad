import {Component, OnDestroy, OnInit} from '@angular/core';

import {ReactiveFormsModule, FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../../core/auth.service';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/user';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'sk-org-login',
    templateUrl: './org-login.component.html',
    styleUrls: ['./org-login.component.scss']
})
export class OrgLoginComponent implements OnInit, OnDestroy {
    signupForm: FormGroup;
    detailForm: FormGroup;
    currentUser: OrgUser;
    destroy$: Subject<boolean> = new Subject<boolean>();
    constructor(public fb: FormBuilder, public auth: AuthService,
    public orgService: OrgService) {

    }

    ngOnInit() {

        this.orgService.getOrgUser$()
            .takeUntil(this.destroy$)
            .subscribe(orgUser => {
                this.currentUser = orgUser;
                console.log(this.currentUser);
            });

        // First Step
        this.signupForm = this.fb.group({
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
            'region': ['', []
            ],
        });
        // Second Step
        this.detailForm = this.fb.group({
            'displayName': ['', [Validators.required]]
        });

    }

    // Using getters will make your code look pretty
    get email() {
        return this.signupForm.get('email');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get displayName() {
        return this.detailForm.get('displayName');
    }

    // Step 1
    signup() {
        return this.orgService.emailSignUp(this.email.value, this.password.value);
    }

    // Step 2
    setCatchPhrase(user) {
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
