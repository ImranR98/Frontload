import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerUserInterface } from 'src/app/models/user.models';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  me: ServerUserInterface | null = null
  loading: boolean = false

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.me().then(me => {
      this.me = me
    }).catch(err => this.router.navigate(['/']))
  }

}
