import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, map, switchMap, take } from 'rxjs/operators'
import { UserService } from './services/user.service'
import { environment } from 'src/environments/environment'

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  // Variables to store state of the interceptor (don't worry about getting out of sync with localStorage, that is still source of truth)
  private isRefreshing = false
  private accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  constructor(private userService: UserService) { }

  // HTTP Interceptor function
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    // Request intercept: Add the access token (if saved) to it
    let authReq = req
    if (this.userService.accessToken)
      authReq = this.cloneRequestWithTokenHeader(req, this.userService.accessToken)

    // Response intercept: If it is an expired access token error, do custom error handling, else throw to be handled elsewhere
    return next.handle(authReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && authReq.url.includes(`${environment.apiURL}/token`) && error.status === 401)
        return this.handleExpiredTokenError(authReq, next)

      return throwError(error)
    }))
  }

  // Clone the provided request with the provided access token in the Authorization header
  private cloneRequestWithTokenHeader = (request: HttpRequest<any>, token: string) => request.clone({ headers: request.headers.set('Authorization', `Bearer ${token}`) })

  // Expired access token error handling
  private handleExpiredTokenError(request: HttpRequest<any>, next: HttpHandler) {
    // Only attempt to refresh the token if it is not already being done
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.accessTokenSubject.next(null)

      // If there is a refresh token stored, use it to get a new access token (then save it while also setting the BehaviorSubject variable above)
      // If that threw an error, assume the refresh token was invalid, delete both tokens, and throw the error
      if (this.userService.refreshToken)
        return this.userService.refreshAccessToken().pipe(
          switchMap((data: any) => {
            this.isRefreshing = false
            this.userService.accessToken = data.token
            this.accessTokenSubject.next(data.token)
            return next.handle(this.cloneRequestWithTokenHeader(request, data.token))
          }),
          catchError((err) => {
            this.isRefreshing = false
            this.userService.logout()
            return throwError(err)
          })
        )
    }

    // Monitor the BehaviorSubject variable for changes if it is not empty, return the original request (to be re-attampted) with the new access token
    return this.accessTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.cloneRequestWithTokenHeader(request, token)))
    )
  }

}
