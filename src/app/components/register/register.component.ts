import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    passwordConfirm: new FormControl('', Validators.required)
  });

  loading: boolean = false;

  constructor(private helperService: HelperService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
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

}
