import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { OtpModalComponent } from 'src/app/components/otp-modal/otp-modal.component';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  loading: boolean = false

  constructor(private toastService: ToastService, private userService: UserService, private router: Router, private modalService: NgbModal) { }

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(),
  });

  ngOnInit() { }

  async changeEmail(event: any) {
    try {
      event.target.classList.add('was-validated')
      if (this.changeEmailForm.valid) {
        this.loading = true;
        const token = await this.userService.beginChangeEmail(this.changeEmailForm.controls['password'].value, this.changeEmailForm.controls['email'].value)
        this.loading = false;
        this.toastService.showToast($localize`A verification code has been emailed to you`, 'info')
        const modalRef = this.modalService.open(OtpModalComponent, { backdrop: 'static' })
        const val = await firstValueFrom(modalRef.closed)
        if (typeof val === 'string') {
          this.loading = true
          await this.userService.completeChangeEmail(token.token, val, this.changeEmailForm.controls['email'].value)
          this.loading = false
          this.router.navigate(['/account'])
        } else {
          this.toastService.showToast($localize`Cancelled - You may try again`, 'danger')
        }
      }
    } catch (err) {
      this.changeEmailForm.reset()
      event.target.classList.remove('was-validated')
      this.loading = false;
    }
  }

}
