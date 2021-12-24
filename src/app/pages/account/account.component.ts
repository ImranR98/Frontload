import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerUserInterface } from 'src/app/models/user.models';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  me: ServerUserInterface | null = null
  loading: boolean = false

  constructor(private userService: UserService, private router: Router, private helperService: HelperService) { }

  ngOnInit(): void {
    this.getMe()
  }

  getMe() {
    this.userService.me().then(me => {
      this.me = me
    }).catch(err => this.router.navigate(['/']))
  }

  revokeLogin(id: string) {
    if (confirm('Revoke that login? You\'ll be logged out if it is your currently used login.')) {
      this.loading = true
      this.userService.revokeLogin(id).then(() => {
        this.getMe()
      }).catch(err => {

      }).finally(() => this.loading = false)
    }
  }

}
