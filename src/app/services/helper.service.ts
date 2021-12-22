import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAppError, AppError } from '../models/error.models';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// This service provides various functions that do not fit elsewhere
// This includes functions for standardizing error messages and presenting them in a snackbar, and a function for HTTP requests
export class HelperService {

  constructor(private snackBar: MatSnackBar, private http: HttpClient) { }

  showSimpleSnackBar(message: string) {
    this.snackBar.dismiss();
    this.snackBar.open(message, 'Okay', {
      duration: 5000
    });
  }

  standardizeError(error: any, actionable: boolean = false) {
    let standardError: IAppError = new AppError(actionable);

    //Since Backend Server routes all 404 requests to the Frontend, this will be seen as a 200 response with HTML body
    if (error instanceof HttpErrorResponse) {
      if (error.status == 200 || error.status == 404) {
        standardError.message = '404 - Not Found'
      } else {
        if (typeof error.error == 'string') {
          if (error.error.indexOf('<!DOCTYPE html') == -1) {
            standardError.message = error.error;
          } else {
            standardError.message = error.statusText;
          }
        } else {
          standardError.message = error.statusText;
        }
      }
    }

    if (typeof error == 'string') {
      standardError.message = error;
    }

    return standardError;
  }

  showError(error: any, callback: Function | null = null, duration: number = 5000) {
    if (!environment.production) {
      console.log(error);
    }
    error = this.standardizeError(error, (!!callback));
    this.snackBar.dismiss();
    let actionText = 'Okay'
    if (callback) {
      actionText = 'Retry'
    }
    if (duration) {
      this.snackBar.open(error.message, actionText, { duration: duration }).onAction().subscribe(() => {
        if (callback) {
          callback();
        }
      });
    } else {
      this.snackBar.open(error.message, actionText).onAction().subscribe(() => {
        if (callback) {
          callback();
        }
      });
    }

  }

  clearError() {
    this.snackBar.dismiss();
  }

  plainRequest = (uri: string, method: 'get' | 'delete' | 'post' | 'put', data: any = null) => method == 'get' || method == 'delete' ? this.http.get(`${environment.apiURL}/${uri}`) : this.http[method](`${environment.apiURL}/${uri}`, data)

  appRequest(uri: string, method: 'get' | 'delete' | 'post' | 'put', data: any = null, showError: boolean = true) {
    return new Promise<any>((resolve, reject) => {
      this.plainRequest(uri, method, data).subscribe({
        next: (result: any) => resolve(result),
        error: (err) => {
          if (showError) this.showError(err)
          reject(err)
        }
      })
    })
  }

}
