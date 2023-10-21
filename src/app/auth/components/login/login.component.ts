import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserModel } from '../../models/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    returnUrl: string;
    hasError: boolean;
    loginState: number = 0
    private unsubscribe: Subscription[] = [];
    constructor
        (
            private authService: AuthService,
            private fb: FormBuilder,
            private route: ActivatedRoute,
            private router: Router
        ) {
        this.form = this.fb.group({
            phoneNumber: [''],
            validationCode: [''],
        });
    }
    ngOnInit(): void {
        this.returnUrl =
            this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
    }


    login() {
        const phoneNumber = this.form.value.phoneNumber;
        const validationCode = this.form.value.validationCode;
        this.hasError = false;
        const loginSubscr = this.authService
            .loginWithPhoneNumber(phoneNumber, validationCode)
            .pipe(first())
            .subscribe((user: UserModel | undefined) => {
                if (user) {
                    if (user.isNew){
                        this.router.navigate(['/me'])
                    }
                    // this.router.navigate([this.returnUrl]);
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(loginSubscr);
    }
    requestVerificationCode() {
        const phoneNumber = this.form.value.phoneNumber;
        this.hasError = false;
        const subscr = this.authService
            .requestVerificationCode(phoneNumber)
            .subscribe((result: any) => {
                this.loginState = 1
                if (result) {
                    console.log('request verification result: ', result)
                    //go to next state.
                    this.loginState = 1
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(subscr);
    }
    onPhoneNumberInput() {

    }
}
