import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loading: boolean = false

  constructor(private helperService: HelperService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  changePasswordForm = new FormGroup({
    password: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
    newPasswordConfirm: new FormControl('', Validators.required),
    revokeRefreshTokens: new FormControl(false)
  });

  ngOnInit() { }

  changePassword() {
    if (this.changePasswordForm.valid) {
      if (this.changePasswordForm.controls['newPassword'].value == this.changePasswordForm.controls['newPasswordConfirm'].value) {
        this.loading = true;
        this.userService.changePassword(this.changePasswordForm.controls['password'].value, this.changePasswordForm.controls['newPassword'].value, this.changePasswordForm.controls['revokeRefreshTokens'].value).then(() => {
          this.loading = false;
          this.helperService.showSimpleSnackBar('Your password has been changed')
          this.router.navigate(['/account'])
        }).catch((err) => {
          this.loading = false;
        })
      } else {
        this.helperService.showSimpleSnackBar('Passwords do not match');
      }
    } else {
      this.helperService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }
  }

}
