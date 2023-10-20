import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserModel } from "../../models/user.model";

let API_URL: string;

@Injectable({
    providedIn: 'root'
})
export class AuthHTTPService {

    constructor(private http: HttpClient) {
        API_URL =`${environment.apiUrl}auth`;
    }

    loginWithPhoneNumber(phoneNumber: string, validationCode: string): Observable<any> {
        return this.http.post<any>(`${API_URL}/LoginWithPhoneNumber/go`, {
            phoneNumber: phoneNumber,
            validationCode: validationCode,
        });
    }
    requestVerificationCode(phoneNumber: string): Observable<any> {
        return this.http.post<any>(`${API_URL}/SendVerificationCode`, {
            phoneNumber: phoneNumber,
        });
    }
    getUserByToken(token: string): Observable<UserModel> {
        const httpHeaders = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<UserModel>(`${API_URL}/current`, {
          headers: httpHeaders,
        });
      }

}
