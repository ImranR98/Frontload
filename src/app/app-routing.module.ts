import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserService } from './services/user/user.service';
import { AccountComponent } from './pages/account/account.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: RegisterComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserService]
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [UserService]
  },
  {
    path: 'change-email',
    component: ChangeEmailComponent,
    canActivate: [UserService]
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [UserService]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
