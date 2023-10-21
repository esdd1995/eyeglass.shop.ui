import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, catchError, finalize, map, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthHTTPService } from './http/auth-http.service';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { Router } from '@angular/router';
import { FileModel } from 'src/app/product/_model/file.model';
import { FileCategory } from 'src/app/common/enum/file-category.enum';

@Injectable({
    providedIn: 'root',
})
export class AuthService implements OnDestroy {
    private authTokenKey = environment.USERDATA_KEY;

    private unsubscribe: Subscription[] = [];
    // public fields
    currentUser$: Observable<UserModel>;
    currentUserSubject: BehaviorSubject<UserModel>;

    isLoading$: Observable<boolean>;
    isLoadingSubject: BehaviorSubject<boolean>;
    private _errorMessage = new BehaviorSubject<string>('');

    get errorMessage$() {
        return this._errorMessage.asObservable();
    }

    constructor(
        private authHttpService: AuthHTTPService,
        private router: Router
    ) {
        this.isLoadingSubject = new BehaviorSubject<boolean>(false);
        this.currentUserSubject = new BehaviorSubject<UserModel>(undefined as any);
        this.currentUser$ = this.currentUserSubject.asObservable();
        this.isLoading$ = this.isLoadingSubject.asObservable();
        const subscr = this.getUserByToken().subscribe();
        this.unsubscribe.push(subscr);
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
    get currentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    set currentUserValue(user: UserModel) {
        this.currentUserSubject.next(user);
    }
    loginWithPhoneNumber(phoneNumber: string, validationCode: string): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.loginWithPhoneNumber(phoneNumber, validationCode).pipe(
            map((auth: AuthModel) => {
                const result = this.setAuthFromLocalStorage(auth);
                return result;
            }),
            switchMap(() => this.getUserByToken()),
            catchError((err) => {
                console.error('err', err);
                return of(err);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }
    requestVerificationCode(phoneNumber: string): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.requestVerificationCode(phoneNumber).pipe(
            map((result: any) => {
                this.isLoadingSubject.next(false);
                return result;
            }),
            catchError((err) => {
                console.error('err', err);
                return of(err);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

    private setAuthFromLocalStorage(auth: AuthModel): boolean {
        // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
        if (auth && auth.authToken) {
            localStorage.setItem(this.authTokenKey, JSON.stringify(auth));
            return true;
        }
        return false;
    }

    private getAuthFromLocalStorage(): AuthModel | undefined {
        try {
            const lsValue = localStorage.getItem(this.authTokenKey);
            if (!lsValue) {
                return undefined;
            }

            const authData = JSON.parse(lsValue);
            return authData;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    getUserByToken(): Observable<UserModel> {
        const auth = this.getAuthFromLocalStorage();
        if (!auth || !auth.authToken) {
            return of();
        }

        this.isLoadingSubject.next(true);
        return this.authHttpService.getUserByToken(auth.authToken).pipe(
            map((user: UserModel) => {
                if (user) {
                    this.currentUserSubject = new BehaviorSubject<UserModel>(user);
                } else {
                    this.logout();
                }
                return user;
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }
    logout(): void {
        localStorage.removeItem(this.authTokenKey);
        this.router.navigate(['/home'], {
            queryParams: {},
        });
    }
    updateUser(user: UserModel): Observable<any> {
        this.isLoadingSubject.next(true);
        return this.authHttpService.updateUser(user).pipe(
            map(() => {
                this.isLoadingSubject.next(false);
            }),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }
    uploadProfilePicture(files: FileModel): Observable<any> {
        this.isLoadingSubject.next(true);
        files.category = FileCategory.ProfilePicture
        return this.authHttpService.upload(files).pipe(
            map((result: any) => {
                this.isLoadingSubject.next(false);
                return result;
            }),
            catchError((err) => {
                console.error('err', err);
                return of(undefined);
            }),
            finalize(() => this.isLoadingSubject.next(false))
        );
    }

}
