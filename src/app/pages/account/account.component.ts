import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerUserInterface } from 'src/app/models/user.models';
import { ToastService } from 'src/app/services/toast/toast.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  me: ServerUserInterface | null = null
  loading: boolean = false

  constructor(private toastService: ToastService, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getMe()
    this.toastService.showToast('Title', 'Body')
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
