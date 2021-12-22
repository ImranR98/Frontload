import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  registerForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  resetPasswordForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  loading: boolean = false;

  constructor(private errorService: HelperService, private userService: UserService) { }

  ngOnInit() { }

  login() {
    this.loading = true;
    this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).then(() => {
      this.loading = false;
    }).catch((err: any) => {
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
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.errorService.showSimpleSnackBar('Passwords do not match');
      }
    } else {
      this.errorService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }

  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
        this.loading = true;
        this.userService.requestPasswordReset(this.resetPasswordForm.controls['email'].value).then(() => {
          this.loading = false;
          this.resetPasswordForm.reset();
        }).catch((err) => {
          this.loading = false;
        })
    } else {
      this.errorService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }

  }

}
