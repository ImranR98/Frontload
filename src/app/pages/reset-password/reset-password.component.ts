import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading: boolean = false
  passwordResetToken: string = ''

  constructor(private toastService: ToastService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  resetPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['passwordResetToken']) {
        this.passwordResetToken = params['passwordResetToken']
      } else {
        this.toastService.showToast('No reset token provided', 'danger')
        this.router.navigate(['/'])
      }
    })
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.controls['password'].value == this.resetPasswordForm.controls['passwordConfirm'].value) {
        this.loading = true;
        this.userService.resetPassword(this.passwordResetToken, this.resetPasswordForm.controls['password'].value).then(() => {
          this.loading = false;
          this.toastService.showToast('Your password has been reset', 'success')
          this.router.navigate(['/'])
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.toastService.showToast('Passwords do not match', 'danger');
      }
    } else {
      this.toastService.showToast('Please fill all fields and provide a valid password', 'danger');
    }
  }
}
