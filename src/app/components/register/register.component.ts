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
    password: new FormControl()
  });

  loading: boolean = false;

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  register(event: any) {
    event.target.classList.add('was-validated')
    if (this.registerForm.valid) {
      this.loading = true;
      this.userService.signUp(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value).then(() => {
        this.toastService.showToast($localize `A verification link has been emailed to you`, 'success')
      }).catch(() => { }).finally(() => {
        this.registerForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }
  }

}
