import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMsg = 'An unknown error occured';
        if (err.error.message) {
          errorMsg = err.error.message;
        }
        this.dialog.open(ErrorComponent, {
          data: {message: errorMsg}
        });
        return throwError(err);
      })
    );
  }
}
