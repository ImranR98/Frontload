import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-bottom-sheet',
  templateUrl: './otp-bottom-sheet.component.html'
})
export class OtpBottomSheetComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { digits: number, name: string }) { }

  otpForm = new UntypedFormGroup({
    code: new UntypedFormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(this.data.digits), Validators.maxLength(this.data.digits)])
  })

  close(event: Event) {
    event.preventDefault()
    this.bottomSheetRef.dismiss(null)
  }

  submit() {
    if (this.otpForm.valid)
      this.bottomSheetRef.dismiss(this.otpForm.controls['code'].value)
  }

}
