import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { ServerUserInterface } from '../models/user.models';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Observable that can be used by anything that needs to know the logged in state
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private router: Router, private helperService: HelperService) {
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
  refreshAccessToken() { return this.helperService.plainRequest('token', 'post', { refreshToken: this.refreshToken }) }

  // Used on manual logout or when HTTP interceptor fails to refresh access token
  logout() {
    this.accessToken = ''
    this.refreshToken = ''
    this.isLoggedIn.next(false)
    this.router.navigate(['/welcome'])
  }

  // Get the current URL (only base part)
  private get currentURLBase() { return `${window.location.href.slice(0, -window.location.pathname.length)}` }

  // Make login request and save tokens if successful
  async login(email: string, password: string) {
    const result = await this.helperService.appRequest('login', 'post', { email, password }) as { token: string, refreshToken: string }
    this.accessToken = result.token
    this.refreshToken = result.refreshToken
    this.isLoggedIn.next(true)
    this.router.navigate(['/'])
  }

  async signUp(email: string, password: string) {
    await this.helperService.appRequest('signup', 'post', { email, password, clientVerificationURL: `${this.currentURLBase}/verify-email` })
  }

  async verifyEmail(emailVerificationToken: string) {
    await this.helperService.appRequest('verify-email', 'post', { emailVerificationToken })
  }

  async requestPasswordReset(email: string) {
    await this.helperService.appRequest('request-password-reset', 'post', { email, clientVerificationURL: `${this.currentURLBase}/reset-password` })
  }

  async resetPassword(passwordResetToken: string, password: string) {
    await this.helperService.appRequest('reset-password', 'post', { passwordResetToken, password })
  }

  async me() {
    return await this.helperService.appRequest('me', 'get') as ServerUserInterface
  }

  async revokeLogin(tokenId: string) {
    await this.helperService.appRequest(`me/logins/${tokenId}`, 'delete')
    this.accessToken = 'abc' // If the user revoked the currently used token, make sure they get logged out on next request
  }

  // Change the password (if successful, optionally ask to invalidate all existing refresh tokens and also accept a new one to replace the current invalid one)
  async changePassword(password: string, newPassword: string, revokeRefreshTokens: boolean = false) {
    const result = await this.helperService.appRequest('me/password', 'put', { password, newPassword, revokeRefreshTokens })
    if (revokeRefreshTokens)
      if (result?.refreshToken)
        this.refreshToken = result.refreshToken
      else this.logout()
  }

  async changeEmail(password: string, email: string) {
    await this.helperService.appRequest('me/email', 'put', { password, email, clientVerificationURL: `${this.currentURLBase}/verify-email` })
  }

  // Used by the router to check if protected routes should be accessible
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.isLoggedIn.value) this.router.navigate(['/welcome'])
    return this.isLoggedIn.value
  }
}
