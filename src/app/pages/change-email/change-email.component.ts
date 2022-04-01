import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OtpBottomSheetComponent } from 'src/app/components/otp-bottom-sheet/otp-bottom-sheet.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {

  constructor(private snackbar: MatSnackBar, private userService: UserService, private router: Router, private bottomSheet: MatBottomSheet) { }

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(),
  });

  set blocked(val: boolean) {
    val ? this.changeEmailForm.disable() : this.changeEmailForm.enable()
  }

  async changeEmail(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.changeEmailForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginChangeEmail(this.changeEmailForm.controls['password'].value, this.changeEmailForm.controls['email'].value)
        const sheetRef = this.bottomSheet.open(OtpBottomSheetComponent, { disableClose: true, data: { digits: 6, name: $localize`Email Verification Code` } })
        const val = await firstValueFrom(sheetRef.afterDismissed())
        if (typeof val === 'string') {
          await this.userService.completeChangeEmail(token.token, val, this.changeEmailForm.controls['email'].value)
          this.router.navigate(['/account'])
        }
        this.blocked = false
      }
    } catch (err) {
      event.target.classList.remove('was-validated')
      this.blocked = false;
    }
  }

}
