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
    password: new FormControl(),
    remember: new FormControl(false)
  });

  constructor(private userService: UserService, private router: Router) { }

  loadSavedEmail() {
    let savedEmail = localStorage.getItem('saved_email')
    if (savedEmail) {
      this.loginForm.controls['email'].setValue(savedEmail)
      this.loginForm.controls['remember'].setValue(true)
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
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
    this.loadSavedEmail()
  }

  set blocked(val: boolean) {
    val ? this.loginForm.disable() : this.loginForm.enable()
  }

  async login(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.loginForm.valid) {
        this.blocked = true
        this.saveSavedEmail()
        await this.userService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value)
        this.blocked = false
      }
    } catch (err) {
      this.blocked = false
      event.target.classList.remove('was-validated')
      this.loadSavedEmail()
    }
  }

}
