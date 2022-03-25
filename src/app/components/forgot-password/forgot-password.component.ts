import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { OtpModalComponent } from '../otp-modal/otp-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl()
  });

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  set blocked(val: boolean) {
    val ? this.resetPasswordForm.disable() : this.resetPasswordForm.enable()
  }

  async resetPassword(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.resetPasswordForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginResetPassword(this.resetPasswordForm.controls['email'].value)
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        const val = await firstValueFrom(modalRef.closed)
        if (typeof val === 'string') {
          await this.userService.completeResetPassword(this.resetPasswordForm.controls['email'].value, this.resetPasswordForm.controls['password'].value, token.token, val)
          this.toastService.showToast($localize`Your password has been reset`, 'success')
          this.router.navigate(['/'])
        } else {
          this.toastService.showToast($localize`Cancelled - You may try again`, 'danger')
        }
        this.blocked = false
      }
    } catch (err) {
      this.resetPasswordForm.reset()
      event.target.classList.remove('was-validated')
      this.blocked = false;
    }

  }

}
