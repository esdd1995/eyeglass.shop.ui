import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription, first, timer } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserModel } from '../../models/user.model';
import { ToastService } from 'src/app/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    form: FormGroup;
    returnUrl: string;
    isLoading: boolean = false
    hasError: boolean;
    loginState: number = 0
    isValidPhoneNumber: boolean = false
    disableLink: boolean
    remainingTime: number //Countdown duration in seconds
    private timerSubscription: Subscription;
    private unsubscribe: Subscription[] = [];
    constructor
        (
            private authService: AuthService,
            private fb: FormBuilder,
            private route: ActivatedRoute,
            private router: Router,
            private toastService: ToastService
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

    setLoginState(newState: number) {
        this.loginState = newState;
        if (newState === 1) {
            this.startTimer();
        }
    }

    private startTimer() {
        this.remainingTime = 60
        this.disableLink = true; // Enable the link after the countdown
        this.timerSubscription = timer(1000, 1000).subscribe(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
            } else {
                this.disableLink = false; // Enable the link after the countdown
                this.timerSubscription.unsubscribe(); // Stop the timer
            }
        });
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
                    if (user.isNew) {
                        this.router.navigate(['/me'])
                        this.toastService.showSuccess('لطفا اطلاعات کاربری خود را تکمیل کنید', 'خوش آمدید');
                    }
                    else {
                        this.toastService.showSuccess('ورود با موفقیت انجام شد');
                        this.router.navigate([this.returnUrl]);
                    }
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(loginSubscr);
    }
    requestVerificationCode() {
        const phoneNumber = this.form.value.phoneNumber;
        this.hasError = false;
        this.isLoading = true
        const subscr = this.authService
            .requestVerificationCode(phoneNumber)
            .subscribe((result: any) => {
                if (result) {
                    this.isLoading = false
                    console.log('request verification result: ', result)
                    //go to next state.
                    this.setLoginState(1)
                } else {
                    this.hasError = true;
                }
            });
        this.unsubscribe.push(subscr);
    }
    checkPhoneNumber() {
        const phoneNumber = this.form.value.phoneNumber;
        var regex = new RegExp("^(\\+98|0)?9\\d{9}$");
        this.isValidPhoneNumber = regex.test(phoneNumber);
    };
}
