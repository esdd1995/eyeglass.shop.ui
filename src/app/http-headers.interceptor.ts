import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthModel } from './auth/models/auth.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  private authTokenKey = environment.USERDATA_KEY;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authData = this.getAuthFromLocalStorage()

    // Clone the request and add the Authorization header with the token
    if (authData && authData.authToken) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authData.authToken}`
        }
      });
      return next.handle(authReq);
    }
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      // Check if the request body is an object
      if (req.body instanceof FormData) {
        // Clone the request and set the necessary headers for file upload
        const cloned = req.clone({
          headers: new HttpHeaders({
            Accept: 'application/json',
          }),
        });

        return next.handle(cloned);
      }
      if (typeof req.body === 'object' && req.body !== null) {
        const headers = req.headers
          .set('accept', 'text/plain')
          .set('Content-Type', 'application/json-patch+json');

        const requestOptions = {
          headers: headers,
          responseType: 'json' as 'json',
        };

        const modifiedReq = req.clone(requestOptions);

        return next.handle(modifiedReq);
      }
    }
    return next.handle(req);
  }
  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const authData = localStorage.getItem(this.authTokenKey);
      if (authData) {
        return JSON.parse(authData);
      }
      else
        return undefined
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
