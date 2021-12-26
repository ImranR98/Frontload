import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AppError, AppErrorInterface, isServerError, serverErrors } from '../../models/error.models';
import { ToastService } from '../toast/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(private toastService: ToastService) { }

  standardizeError(error: any, actionable: boolean = false) {
    let standardError: AppErrorInterface = new AppError(actionable);

    if (error instanceof HttpErrorResponse && error.error) error = error.error

    if (isServerError(error))
      standardError.message = serverErrors[error.code]

    if (error instanceof HttpErrorResponse)
      standardError.message = error.statusText

    if (typeof error == 'string')
      standardError.message = error;

    return standardError;
  }

  showError(error: any) {
    if (!environment.production) {
      console.log(error);
    }
    error = this.standardizeError(error, false);
    this.toastService.showToast('Error', error.message)
  }
}
