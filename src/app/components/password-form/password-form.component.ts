import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroupDirective, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html'
})
export class PasswordFormComponent implements OnInit, OnChanges {

  @Input() disabled: boolean = false
  @Input() label: string = $localize`Password`
  @Input() controlName: string = 'password'
  @Input() enforceReqs: boolean = false

  password: FormControl | undefined

  constructor(private rootFormGroup: FormGroupDirective) { }

  // Password may fail validation in several ways, but only one error message should be shown at a time
  // This function checks which error codes the formControl has and returns the highest priority one
  // This could have been used to directly return an error message, but those should be in the template in order to maintain consistency with other formControls
  passwordErrorToShow() {
    const possibleCodesInPriorityOrder = ['required', 'minlength']
    for (let code of possibleCodesInPriorityOrder) {
      if (this.password?.errors?.[code]) return code
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

  // Enable the password field whenever the @Input disabled property changes
  ngOnChanges(changes: SimpleChanges): void {
    for (let propName in changes) {
      if (propName === 'disabled') {
        this.disabled ? this.password?.disable() : this.password?.enable()
      }
    }
  }
}
