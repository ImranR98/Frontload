import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {

  title: string = $localize`Confirmation`
  message: string = $localize`Are you sure?`

  constructor(public activeModal: NgbActiveModal) { }

}
