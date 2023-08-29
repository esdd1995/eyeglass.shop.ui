import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
      // Check if the request body is an object
      if (typeof req.body === 'object' && req.body !== null) {
        // Define your common headers
        const headers = req.headers
          .set('accept', 'text/plain')
          .set('Content-Type', 'application/json-patch+json');

        // Define your common request options
        const requestOptions = {
          headers: headers,
          responseType: 'json' as 'json', // Set the expected response type to text/plain
        };

        // Clone the original request and apply headers and options
        const modifiedReq = req.clone(requestOptions);

        // Pass the modified request to the next handler
        return next.handle(modifiedReq);
      }
    }

    // Continue with the original request
    return next.handle(req);
  }
}
