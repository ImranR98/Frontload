import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  constructor(private modalService: NgbModal, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.getMe()
  }

  formatUAString(uaString: string) {
    const UA = UAParser(uaString)
    let finalString = ''
    if (UA.browser.name) {
      finalString += UA.browser.name
      UA.browser.version ? finalString += ` ${UA.browser.version} ` : finalString += ' '
    } else finalString += 'Unknown browser '
    let OSSegmentPrefix = 'running'
    if (UA.device.vendor && UA.device.model)
      finalString += `on a${['a,e,i,o,u'].includes(UA.device.vendor[0].toLowerCase()) ? 'n' : ''} ${UA.device.vendor} ${UA.device.model} `
    else OSSegmentPrefix = 'on'
    if (UA.os.name) {
      finalString += `${OSSegmentPrefix} ${UA.os.name}`
      UA.os.version ? finalString += ` ${UA.os.version}` : null
    }
    return finalString
  }

  getMe() {
    this.userService.me().then(me => {
      this.me = me
    }).catch(err => this.router.navigate(['/']))
  }

  revokeLogin(id: string) {
    const modalRef = this.modalService.open(ConfirmModalComponent)
    modalRef.componentInstance.message = 'Revoke this login?'
    modalRef.closed.subscribe(val => {
      if (val) {
        this.loading = true
        this.userService.revokeLogin(id).then(() => {
          this.getMe()
        }).catch(err => {

        }).finally(() => this.loading = false)
      }
    })
  }

}
