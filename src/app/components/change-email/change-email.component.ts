import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  loading: boolean = false

  constructor(private helperService: HelperService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  changeEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit() { }

  changeEmail() {
    if (this.changeEmailForm.valid) {
      this.loading = true;
      this.userService.changeEmail(this.changeEmailForm.controls['password'].value, this.changeEmailForm.controls['email'].value).then(() => {
        this.loading = false;
        this.helperService.showSimpleSnackBar('A verification link has been emailed to you')
        this.router.navigate(['/account'])
      }).catch((err) => {
        this.loading = false;
      })
    } else {
      this.helperService.showSimpleSnackBar('Please fill all fields and provide a valid password');
    }
  }

}
