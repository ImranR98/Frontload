import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { OtpModalComponent } from '../otp-modal/otp-modal.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl()
  });

  loading: boolean = false;

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  resetPassword(event: any) {
    event.target.classList.add('was-validated')
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.userService.beginResetPassword(this.resetPasswordForm.controls['email'].value).then(token => {
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        modalRef.closed.subscribe(val => {
          if (typeof val === 'string') {
            this.loading = true
            this.userService.completeResetPassword(this.resetPasswordForm.controls['email'].value, this.resetPasswordForm.controls['password'].value, token.token, val).then(() => {
              this.toastService.showToast($localize`Your password has been reset`, 'success')
              this.router.navigate(['/'])
            }).catch(() => { }).finally(() => this.loading = false)
          } else {
            this.toastService.showToast($localize`Cancelled - You may try again`, 'danger')
          }
        })
      }).catch(() => {
        this.resetPasswordForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }

  }

}
