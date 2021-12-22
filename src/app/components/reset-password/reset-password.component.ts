import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading: boolean = false
  passwordResetToken: string = ''

  constructor(private helperService: HelperService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  resetPasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['passwordResetToken']) {
        this.passwordResetToken = params['passwordResetToken']
      } else {
        this.helperService.showSimpleSnackBar('No reset token provided')
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
          this.helperService.showSimpleSnackBar('Your password has been reset')
          this.router.navigate(['/'])
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.helperService.showSimpleSnackBar('Passwords do not match');
      }
    } else {
      this.helperService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }
  }
}
