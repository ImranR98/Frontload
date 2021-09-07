import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // Observable that can be used by anything that needs to know the logged in state
  isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  constructor(private http: HttpClient, private router: Router) { }

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
  refreshAccessToken() { return this.http.post(`${environment.apiURL}/token`, { refreshToken: this.refreshToken }) }

  // Used on manual logout or when HTTP interceptor fails to refresh access token
  logout() {
    this.accessToken = ''
    this.refreshToken = ''
    this.isLoggedIn.next(false)
    this.router.navigate(['/'])
  }

  private get currentURLBase() { return `${window.location.href.slice(0, -window.location.pathname.length)}` }

  async login(email: string, password: string) {
    const result = await this.http.post(`${environment.apiURL}/login`, { email, password }).toPromise() as { token: string, refreshToken: string }
    this.accessToken = result.token
    this.refreshToken = result.refreshToken
  }

  async signUp(email: string, password: string) {
    await this.http.post(`${environment.apiURL}/signup`, { email, password, clientVerificationURL: `${this.currentURLBase}/verify-email` }).toPromise()
  }

  async verifyEmail(emailVerificationToken: string) {
    await this.http.post(`${environment.apiURL}/verify-email`, { emailVerificationToken }).toPromise()
  }

  async requestPasswordReset(email: string) {
    await this.http.post(`${environment.apiURL}/request-password-reset`, { email, clientVerificationURL: `${this.currentURLBase}/reset-password` }).toPromise()
  }

  async resetPassword(passwordResetToken: string) {
    await this.http.post(`${environment.apiURL}/reset-password`, { passwordResetToken }).toPromise()
  }

  async me() {
    return await this.http.get(`${environment.apiURL}/me`)
      .toPromise() as { _id: number, email: string, verified: boolean, refreshTokens: { _id: string, ip: string, userAgent?: string, date: Date }[] }
  }

  async revokeLogin(tokenId: string) {
    await this.http.delete(`${environment.apiURL}/me/logins/${tokenId}`)
  }

  async changePassword(password: string, newPassword: string, revokeRefreshTokens: boolean = false) {
    const res = await this.http.put(`${environment.apiURL}/me/password`, { password, newPassword, revokeRefreshTokens }).toPromise() as any
    if (revokeRefreshTokens)
      if (res?.refreshToken)
        this.refreshToken = res.refreshToken
      else this.logout()
  }

  async changeEmail(password: string, email: string) {
    await this.http.put(`${environment.apiURL}/me/email`, { password, email, clientVerificationURL: `${this.currentURLBase}/verify-email` }).toPromise()
  }

  // Used by the router to check if protected routes should be accessible
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.router.navigate(['/welcome'])
    return this.isLoggedIn.value
  }
}
