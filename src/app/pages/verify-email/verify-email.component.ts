import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  verified: boolean = false

  constructor(private helperService: HelperService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['emailVerificationToken']) {
        this.userService.verifyEmail(params['emailVerificationToken']).then(() => {
          this.verified = true
        }).catch((err) => {
          this.router.navigate(['/'])
        })
      } else {
        this.helperService.showSimpleSnackBar('No verification token provided')
        this.router.navigate(['/'])
      }
    })
  }

}
