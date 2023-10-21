import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { UserModel } from "../../models/user.model";
import { FileModel } from "src/app/product/_model/file.model";

let API_URL: string;

@Injectable({
    providedIn: 'root'
})
export class AuthHTTPService {

    constructor(private http: HttpClient) {
        API_URL = `${environment.apiUrl}auth`;
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
    updateUser(user: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(`${API_URL}/update`, user);
    }
    upload(fileModel: FileModel): Observable<any> {
        const formData: FormData = new FormData();
        for (let i = 0; i < fileModel.files.length; i++) {
            formData.append('files', fileModel.files[i], fileModel.files[i].name);
        }
        formData.append('category', fileModel.category.toString())
        return this.http.post<any>(`${environment.apiUrl}Upload`, formData);
    }
}
