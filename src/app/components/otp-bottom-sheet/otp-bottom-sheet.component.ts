import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-bottom-sheet',
  templateUrl: './otp-bottom-sheet.component.html'
})
export class OtpBottomSheetComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { digits: number, message: string, name: string } = { digits: 6, message: $localize`Enter the ${data.digits} digit code that was sent to you.`, name: $localize`One Time Code` }) { }

  otpForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(this.data.digits), Validators.maxLength(this.data.digits)])
  })

  close() {
    this.bottomSheetRef.dismiss(null)
  }

  submit(event: any) {
    event.target.classList.add('was-validated')
    if (this.otpForm.valid)
      this.bottomSheetRef.dismiss(this.otpForm.controls['code'].value)
  }

}
