import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { OtpModalComponent } from '../otp-modal/otp-modal.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl()
  });

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  set blocked(val: boolean) {
    val ? this.registerForm.disable() : this.registerForm.enable()
  }

  async register(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.registerForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginSignUp(this.registerForm.controls['email'].value)
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        const val = await firstValueFrom(modalRef.closed)
        if (typeof val === 'string') {
          await this.userService.completeSignUp(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value, token.token, val)
          this.toastService.showToast($localize`Sign up successful`, 'success')
          this.registerForm.reset()
          event.target.classList.remove('was-validated')
        } else {
          this.toastService.showToast($localize`Cancelled - You may try again`, 'danger')
        }
        this.blocked = false
      }
    } catch (err) {
      event.target.classList.remove('was-validated')
      this.blocked = false;
    }
  }

}
