import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

  plainRequest = (uri: string, method: 'get' | 'delete' | 'post' | 'put', data: any = null) => method == 'get' || method == 'delete' ? this.http[method](`${environment.apiURL}/${uri}`) : this.http[method](`${environment.apiURL}/${uri}`, data)

  appRequest(uri: string, method: 'get' | 'delete' | 'post' | 'put', data: any = null, showError: boolean = true) {
    return new Promise<any>((resolve, reject) => {
      this.plainRequest(uri, method, data).subscribe({
        next: (result: any) => resolve(result),
        error: (err) => {
          if (showError) this.errorService.showError(err)
          reject(err)
        }
      })
    })
  }
}
