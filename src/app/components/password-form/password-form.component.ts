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
  @Input() formGroupName: string = 'passwordForm'

  password: FormControl | undefined
  passwordConfirm: FormControl | undefined

  constructor(private rootFormGroup: FormGroupDirective) { }

  // Custom validator to check that password meets requirements
  validatePassword(passwordControl: AbstractControl): ValidationErrors | null {
    if ((passwordControl.value || '').length < 6)
      return { short: true }
    return null
  }

  // Password may fail validation in several ways, but only one error message should be shown at a time
  // This function checks which error codes the formControl has and returns the highest priority one
  // This could have been used to directly return an error message, but those should be in the template in order to maintain consistency with other formControls
  passwordErrorToShow() {
    const possibleCodesInPriorityOrder = ['required', 'short']
    for (let i = 0; i < possibleCodesInPriorityOrder.length; i++) {
      if (this.password?.errors?.[possibleCodesInPriorityOrder[i]]) return possibleCodesInPriorityOrder[i]
    }
    return 'other'
  }

  // Check that the password and passwordConfirm controls match
  validateConfirmPassword(confirmPasswordControl: AbstractControl): ValidationErrors | null {
    if (!(confirmPasswordControl.parent instanceof FormGroup)) return null
    if (!confirmPasswordControl.parent.controls['passwordConfirm']) return null
    if ((confirmPasswordControl.parent.controls['password'].value || '') !== (confirmPasswordControl.parent.controls['passwordConfirm'].value || ''))
      return { mismatch: true }
    return null
  }

  // Grab the parent's formGroup for password and add the relevant validators
  // The custom password requirements validator is only used if the formGroup contains a confirmPassword field
  ngOnInit(): void {
    const form = this.rootFormGroup.control.get(this.formGroupName) as FormGroup
    if (form.controls['password']) this.password = form.controls['password'] as FormControl
    if (form.controls['passwordConfirm']) this.passwordConfirm = form.controls['passwordConfirm'] as FormControl
    this.password?.setValidators([Validators.required])
    if (this.passwordConfirm) {
      this.password?.addValidators([this.validatePassword])
      this.passwordConfirm.setValidators([Validators.required, this.validateConfirmPassword])
    }
  }
}
