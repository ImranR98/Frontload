import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss']
})
export class PasswordFormComponent implements OnInit {

  @Input() disabled: boolean = false
  @Input() placeHolder: string = 'Password'
  @Input() controlName: string = 'password'
  @Input() enforceReqs: boolean = false

  password: FormControl | undefined

  constructor(private rootFormGroup: FormGroupDirective) { }

  // Password may fail validation in several ways, but only one error message should be shown at a time
  // This function checks which error codes the formControl has and returns the highest priority one
  // This could have been used to directly return an error message, but those should be in the template in order to maintain consistency with other formControls
  passwordErrorToShow() {
    const possibleCodesInPriorityOrder = ['required', 'minlength']
    for (let i = 0; i < possibleCodesInPriorityOrder.length; i++) {
      if (this.password?.errors?.[possibleCodesInPriorityOrder[i]]) return possibleCodesInPriorityOrder[i]
    }
    return 'other'
  }

  // Grab the parent's formGroup for password and add the relevant validators
  // The custom password requirements validator is only used if the formGroup contains a confirmPassword field
  ngOnInit(): void {
    this.password = this.rootFormGroup.control.get(this.controlName) as FormControl
    this.enforceReqs ?
      this.password?.setValidators([Validators.required, Validators.minLength(8)]) :
      this.password?.setValidators([Validators.required])

  }
}
