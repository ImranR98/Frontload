import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  resetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loading: boolean = false;

  constructor(private helperService: HelperService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  login() {
    this.loading = true;
    this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).finally(() => {
      this.loading = false;
    })
  }

  register() {
    if (this.registerForm.valid) {
      if (this.registerForm.controls['password'].value == this.registerForm.controls['passwordConfirm'].value) {
        this.loading = true;
        this.userService.signUp(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value).then(() => {
          this.loading = false;
          this.registerForm.reset();
          this.helperService.showSimpleSnackBar('A verification link has been emailed to you')
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
