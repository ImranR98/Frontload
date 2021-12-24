import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  loading: boolean = false;

  constructor(private helperService: HelperService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  login() {
    this.loading = true;
    this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).catch(() => { }).finally(() => {
      this.loading = false;
    })
  }

}
