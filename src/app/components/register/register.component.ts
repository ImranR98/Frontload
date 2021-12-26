import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

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

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

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
          this.toastService.showToast('A verification link has been emailed to you', 'success')
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
