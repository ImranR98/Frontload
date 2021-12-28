import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loading: boolean = false;

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  resetPassword(event: any) {
    event.target.classList.add('was-validated')
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.userService.requestPasswordReset(this.resetPasswordForm.controls['email'].value).then(() => {
        this.toastService.showToast('A password reset link has been emailed to you', 'success')
      }).catch(() => { }).finally(() => {
        this.resetPasswordForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }

  }

}
