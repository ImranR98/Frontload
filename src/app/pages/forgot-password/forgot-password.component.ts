import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { OtpBottomSheetComponent } from '../../components/otp-bottom-sheet/otp-bottom-sheet.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

  newPasswordLabel = $localize`New Password`

  resetPasswordForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl()
  });

  constructor(private snackbar: MatSnackBar, private userService: UserService, private router: Router, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    if (this.userService.isLoggedIn.value) this.router.navigate(['/'])
  }

  set blocked(val: boolean) {
    val ? this.resetPasswordForm.disable() : this.resetPasswordForm.enable()
  }

  async resetPassword() {
    try {
      if (this.resetPasswordForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginResetPassword(this.resetPasswordForm.controls['email'].value)
        const sheetRef = this.bottomSheet.open(OtpBottomSheetComponent, { disableClose: true, data: { digits: 6, name: $localize`Password Verification Code` } })
        const val = await firstValueFrom(sheetRef.afterDismissed())
        if (typeof val === 'string') {
          await this.userService.completeResetPassword(this.resetPasswordForm.controls['email'].value, this.resetPasswordForm.controls['password'].value, token.token, val)
          this.snackbar.open($localize`Your password has been reset`)
          this.router.navigate(['/'])
        } else {
          this.snackbar.open($localize`Cancelled - You may try again`)
        }
        this.blocked = false
      }
    } catch (err) {
      this.resetPasswordForm.reset()
      this.blocked = false;
    }

  }

}
