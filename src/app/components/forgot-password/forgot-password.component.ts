import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private helperService: HelperService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.loading = true;
      this.userService.requestPasswordReset(this.resetPasswordForm.controls['email'].value).then(() => {
        this.loading = false;
        this.resetPasswordForm.reset();
        this.helperService.showSimpleSnackBar('A password reset link has been emailed to you')
      }).catch((err) => {
        this.loading = false;
      })
    } else {
      this.helperService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }

  }

}
