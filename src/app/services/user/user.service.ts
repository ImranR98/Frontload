import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServerUserInterface } from '../../models/user.models';
import { RequestService } from '../request/request.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Observable that can be used by anything that needs to know the logged in state
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private router: Router, private requestService: RequestService) {
    if (this.refreshToken.length > 0) this.isLoggedIn.next(true)
  }

  // Getters and setters for access and refresh tokens
  set accessToken(token: string) {
    localStorage.setItem('access_token', token)
  }
  get accessToken() {
    return localStorage.getItem('access_token') || ''
  }
  set refreshToken(refreshToken: string) {
    localStorage.setItem('refresh_token', refreshToken)
  }
  get refreshToken() {
    return localStorage.getItem('refresh_token') || ''
  }

  // Make HTTP request to refresh the access token; used by the HTTP interceptor
  refreshAccessToken() { return this.requestService.plainRequest('token', 'post', { refreshToken: this.refreshToken }) }

  // Used on manual logout or when HTTP interceptor fails to refresh access token
  async logout() {
    // Ask server to delete refreshToken but don't care about the response (even an error)
    try {
      await this.requestService.appRequest(`logout`, 'post', { refreshToken: this.refreshToken })
    } catch (err) { }
    this.accessToken = ''
    this.refreshToken = ''
    this.isLoggedIn.next(false)
    this.router.navigate(['/login'])
  }

  // Make login request and save tokens if successful
  async login(email: string, password: string) {
    const result = await this.requestService.appRequest('login', 'post', { email, password }) as { token: string, refreshToken: string }
    this.accessToken = result.token
    this.refreshToken = result.refreshToken
    this.isLoggedIn.next(true)
    this.router.navigate(['/'])
  }

  async beginSignUp(email: string) {
    return await this.requestService.appRequest('signup/begin', 'post', { email }) as { token: string }
  }

  async completeSignUp(email: string, password: string, token: string, code: string) {
    await this.requestService.appRequest('signup/complete', 'post', { email, password, token, code })
  }

  async beginResetPassword(email: string) {
    return await this.requestService.appRequest('reset-password-begin', 'post', { email }) as { token: string }
  }

  async completeResetPassword(email: string, password: string, token: string, code: string) {
    await this.requestService.appRequest('reset-password-complete', 'post', { email, password, token, code })
  }

  async beginChangeEmail(password: string, email: string) {
    return await this.requestService.appRequest('me/email/begin-change', 'post', { password, email }) as { token: string }
  }

  async completeChangeEmail(token: string, code: string, email: string) {
    await this.requestService.appRequest('me/email/complete-change', 'post', { token, code, email })
  }

  async me() {
    return await this.requestService.appRequest('me', 'get') as ServerUserInterface
  }

  async revokeLogin(tokenId: string) {
    await this.requestService.appRequest(`me/logins/${tokenId}`, 'delete')
    this.accessToken = 'abc' // If the user revoked the currently used token, make sure they get logged out on next request
  }

  // Change the password (if successful, optionally ask to invalidate all existing refresh tokens and also accept a new one to replace the current invalid one)
  async changePassword(password: string, newPassword: string, revokeRefreshTokens: boolean = false) {
    const result = await this.requestService.appRequest('me/password', 'put', { password, newPassword, revokeRefreshTokens })
    if (revokeRefreshTokens)
      if (result?.refreshToken)
        this.refreshToken = result.refreshToken
      else this.logout()
  }

  // Used by the router to check if protected routes should be accessible
  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isLoggedIn.value) {
      this.router.navigate(['/login'])
    }
    return this.isLoggedIn.value
  }
}
