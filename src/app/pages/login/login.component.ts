import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl(),
    remember: new UntypedFormControl(false)
  });

  constructor(private userService: UserService, private router: Router) { }

  loadSavedEmail() {
    let savedEmail = localStorage.getItem('saved_email')
    if (savedEmail) {
      setTimeout(() => {
        this.loginForm.controls['email'].setValue(savedEmail)
      this.loginForm.controls['remember'].setValue(true)
      })
    }
  }

  saveSavedEmail() {
    if (this.loginForm.controls['remember'].value === true) {
      localStorage.setItem('saved_email', this.loginForm.controls['email'].value)
    } else {
      localStorage.removeItem('saved_email')
    }
  }

  ngOnInit() {
    if (this.userService.isLoggedIn.value) this.router.navigate(['/'])
    this.loadSavedEmail()
  }

  set blocked(val: boolean) {
    val ? this.loginForm.disable() : this.loginForm.enable()
  }

  async login() {
    try {
      if (this.loginForm.valid) {
        this.blocked = true
        this.saveSavedEmail()
        await this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
        this.blocked = false
      }
    } catch (err) {
      this.blocked = false
      this.loadSavedEmail()
    }
  }

}
