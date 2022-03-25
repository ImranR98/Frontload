import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { OtpModalComponent } from 'src/app/components/otp-modal/otp-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(),
  });

  set blocked(val: boolean) {
    val ? this.changeEmailForm.disable() : this.changeEmailForm.enable()
  }

  async changeEmail(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.changeEmailForm.valid) {
        this.blocked = true;
        const token = await this.userService.beginChangeEmail(this.changeEmailForm.controls['password'].value, this.changeEmailForm.controls['email'].value)
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        const val = await firstValueFrom(modalRef.closed)
        if (typeof val === 'string') {
          await this.userService.completeChangeEmail(token.token, val, this.changeEmailForm.controls['email'].value)
          this.router.navigate(['/account'])
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
