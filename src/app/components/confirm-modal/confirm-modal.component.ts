import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  title: string = $localize`Confirmation`
  message: string = $localize`Are you sure?`

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void { }

}
