import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { OtpBottomSheetComponent } from 'src/app/components/otp-bottom-sheet/otp-bottom-sheet.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl()
  });

  constructor(private snackbar: MatSnackBar, private userService: UserService, private router: Router, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    if (this.userService.isLoggedIn.value) this.router.navigate(['/'])
  }

  set blocked(val: boolean) {
    val ? this.registerForm.disable() : this.registerForm.enable()
  }

  async register() {
    try {
      if (this.registerForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginSignUp(this.registerForm.controls['email'].value)
        this.snackbar.open($localize`A verification code has been emailed to you`)
        const sheetRef = this.bottomSheet.open(OtpBottomSheetComponent, { disableClose: true })
        const val = await firstValueFrom(sheetRef.afterDismissed())
        if (typeof val === 'string') {
          await this.userService.completeSignUp(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value, token.token, val)
          this.snackbar.open($localize`Sign up successful`)
          this.registerForm.reset()
        } else {
          this.snackbar.open($localize`Cancelled - You may try again`)
        }
        this.blocked = false
      }
    } catch (err) {
      this.blocked = false;
    }
  }

}
