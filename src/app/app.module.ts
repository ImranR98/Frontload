import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { AppHttpInterceptor } from './app-http.interceptor';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { AccountComponent } from './pages/account/account.component'
import { CommonModule } from '@angular/common';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { PasswordFormComponent } from './components/password-form/password-form.component';
import { OtpModalComponent } from './components/otp-modal/otp-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AccountComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ToastComponent,
    ConfirmModalComponent,
    PasswordFormComponent,
    OtpModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AppHttpInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
