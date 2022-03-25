import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html'
})
export class OtpModalComponent {

  title: string = $localize`One Time Code`
  digits: number = 6
  message: string = $localize`Enter the ${this.digits} digit code that was sent to you.`


  otpForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(this.digits), Validators.maxLength(this.digits)])
  });

  constructor(public activeModal: NgbActiveModal) { }

  submit(event: any) {
    event.target.classList.add('was-validated')
    if (this.otpForm.valid)
      this.activeModal.close(this.otpForm.controls['code'].value)
  }

}
