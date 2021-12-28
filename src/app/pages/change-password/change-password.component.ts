import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loading: boolean = false

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  changePasswordForm = new FormGroup({
    passwordForm: new FormGroup({
      password: new FormControl()
    }),
    newPasswordForm: new FormGroup({
      password: new FormControl(),
      passwordConfirm: new FormControl()
    }),
    revokeRefreshTokens: new FormControl(false)
  });

  ngOnInit() { }

  changePassword(event: any) {
    event.target.classList.add('was-validated')
    if (this.changePasswordForm.valid) {
      this.loading = true;
      this.userService.changePassword(this.changePasswordForm.controls['password'].value, this.changePasswordForm.controls['newPassword'].value, this.changePasswordForm.controls['revokeRefreshTokens'].value).then(() => {
        this.loading = false;
        this.toastService.showToast('Your password has been changed', 'success')
        this.router.navigate(['/account'])
      }).catch((err) => {
        this.loading = false;
      })
    } else {
      this.toastService.showToast('Please fill all fields and provide a valid password', 'danger');
    }
  }

}
