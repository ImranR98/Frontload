import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl()
  });

  loading: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  login(event: any) {
    event.target.classList.add('was-validated')
    if (this.loginForm.valid) {
      this.loading = true;
      this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).catch(() => {
        this.loginForm.reset()
        event.target.classList.remove('was-validated')
      }).finally(() => {
        this.loading = false;
      })
    }
  }

}
