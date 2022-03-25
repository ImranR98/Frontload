import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';
import { ServerUserInterface } from 'src/app/models/user.models';
import { UserService } from 'src/app/services/user/user.service';
import { UAParser } from 'ua-parser-js'

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  me: ServerUserInterface | null = null
  loading: boolean = false
  public isCollapsed = true

  loginsCollapseText = {
    show: $localize`Show Logged In Devices`,
    hide: $localize`Hide Logged In Devices`
  }

  constructor(private modalService: NgbModal, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getMe()
  }

  formatUAString(uaString: string) {
    const UA = UAParser(uaString)
    let finalString = ''
    if (UA.browser.name) {
      finalString += UA.browser.name
      UA.browser.version ? finalString += ` ${UA.browser.version}` : ''
    } else {
      finalString += $localize`Unknown browser`
    }
    if (UA.device.vendor && UA.device.model) {
      finalString += ' - '
      finalString += `${UA.device.vendor} ${UA.device.model}`
    }
    if (UA.os.name) {
      finalString += ' - '
      finalString += `${UA.os.name}`
      UA.os.version ? finalString += ` ${UA.os.version}` : ''
    }
    return finalString
  }

  async getMe() {
    try {
      this.me = await this.userService.me()
    } catch (err) {
      this.router.navigate(['/'])
    }
  }

  async revokeLogin(id: string) {
    try {
      const modalRef = this.modalService.open(ConfirmModalComponent)
      modalRef.componentInstance.message = $localize`Revoke this login?`
      const val = await firstValueFrom(modalRef.closed)
      if (val) {
        this.loading = true
        await this.userService.revokeLogin(id)
        await this.getMe()
        this.loading = false
      }
    } catch (err) {
      this.loading = false
    }
  }

}
