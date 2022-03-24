import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.scss']
})
export class OtpModalComponent implements OnInit {

  title: string = $localize`One Time Code`
  digits: number = 6
  message: string = $localize`Enter the ${this.digits} digit code that was sent to you.`


  otpForm = new FormGroup({
    code: new FormControl('', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(this.digits), Validators.maxLength(this.digits)])
  });

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  submit(event: any) {
    event.target.classList.add('was-validated')
    if (this.otpForm.valid)
      this.activeModal.close(this.otpForm.controls['code'].value)
  }

}
