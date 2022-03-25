import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean = false
  private subscriptions: Subscription[] = []
  public collapsed=true
  
  constructor(private userService: UserService, public route: ActivatedRoute) { }

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
