import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  loading: boolean = false

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(),
  });

  ngOnInit() { }

  changeEmail(event: any) {
    event.target.classList.add('was-validated')
    if (this.changeEmailForm.valid) {
      this.loading = true;
      this.userService.changeEmail(this.changeEmailForm.controls['password'].value, this.changeEmailForm.controls['email'].value).then(() => {
        this.loading = false;
        this.toastService.showToast($localize `A verification link has been emailed to you`, 'success')
        this.router.navigate(['/account'])
      }).catch((err) => {
        this.changeEmailForm.reset()
        event.target.classList.remove('was-validated')
        this.loading = false;
      })
    }
  }

}
