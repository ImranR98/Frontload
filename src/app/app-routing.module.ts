import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { UserService } from './services/user.service';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AccountComponent } from './pages/account/account.component';
import { ChangeEmailComponent } from './pages/change-email/change-email.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
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
