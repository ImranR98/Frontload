import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  changePasswordForm = new FormGroup({
    password: new FormControl(),
    newPassword: new FormControl(),
    revokeRefreshTokens: new FormControl(false)
  });

  set blocked(val: boolean) {
    val ? this.changePasswordForm.disable() : this.changePasswordForm.enable()
  }

  async changePassword(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.changePasswordForm.valid) {
        this.blocked = true;
        await this.userService.changePassword(this.changePasswordForm.controls['password']?.value, this.changePasswordForm.controls['newPassword'].value, this.changePasswordForm.controls['revokeRefreshTokens'].value)
        this.blocked = false;
        this.toastService.showToast($localize`Your password has been changed`, 'success')
        this.router.navigate(['/account'])
      }
    } catch (err) {
      event.target.classList.remove('was-validated')
      this.blocked = false;
    }
  }

}
