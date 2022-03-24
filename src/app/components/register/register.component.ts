import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';
import { OtpModalComponent } from '../otp-modal/otp-modal.component';

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

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    if (this.userService.isLoggedIn) this.router.navigate(['/'])
  }

  register(event: any) {
    event.target.classList.add('was-validated')
    if (this.registerForm.valid) {
      this.loading = true;
      this.userService.beginSignUp(this.registerForm.controls['email'].value).then(token => {
        this.loading = false
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        modalRef.closed.subscribe(val => {
          if (typeof val === 'string') {
            this.loading = true
            this.userService.completeSignUp(this.registerForm.controls['email'].value, this.registerForm.controls['password'].value, token.token, val).then(() => {
              this.toastService.showToast($localize`Sign up successful`, 'success')
              this.registerForm.reset()
              event.target.classList.remove('was-validated')
            }).catch(() => { }).finally(() => this.loading = false)
          } else {
            this.toastService.showToast($localize`Cancelled - You may try again`, 'danger')
          }
        })
      }).catch(() => {
        this.registerForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }
  }

}
