import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false
  private subscriptions: Subscription[] = []

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.userService.isLoggedIn.subscribe(val => this.isLoggedIn = val))
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  logout(): void {
    this.userService.logout()
  }

}
