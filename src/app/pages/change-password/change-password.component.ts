import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent {

  constructor(private snackbar: MatSnackBar, private userService: UserService, private router: Router) { }

  changePasswordForm = new FormGroup({
    password: new FormControl(),
    newPassword: new FormControl(),
    revokeRefreshTokens: new FormControl(false)
  });

  set blocked(val: boolean) {
    val ? this.changePasswordForm.disable() : this.changePasswordForm.enable()
  }

  async changePassword() {
    try {
      if (this.changePasswordForm.valid) {
        this.blocked = true;
        await this.userService.changePassword(this.changePasswordForm.controls['password']?.value, this.changePasswordForm.controls['newPassword'].value, this.changePasswordForm.controls['revokeRefreshTokens'].value)
        this.blocked = false;
        this.snackbar.open($localize`Your password has been changed`)
        this.router.navigate(['/account'])
      }
    } catch (err) {
      this.blocked = false;
    }
  }

}
