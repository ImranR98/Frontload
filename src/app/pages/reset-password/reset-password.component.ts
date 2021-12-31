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
    password: new FormControl()
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['passwordResetToken']) {
        this.passwordResetToken = params['passwordResetToken']
      } else {
        this.toastService.showToast($localize`No reset token provided`, 'danger')
        this.router.navigate(['/'])
      }
    })
  }

  resetPassword(event: any) {
    event.target.classList.add('was-validated')
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.userService.resetPassword(this.passwordResetToken, this.resetPasswordForm.controls['password'].value).then(() => {
        this.loading = false;
        this.toastService.showToast($localize`Your password has been reset`, 'success')
        this.router.navigate(['/'])
      }).catch((err) => {
        this.resetPasswordForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }
  }
}
