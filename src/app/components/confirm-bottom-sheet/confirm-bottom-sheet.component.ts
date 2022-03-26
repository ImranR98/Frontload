import { Component, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-confirm-bottom-sheet',
  templateUrl: './confirm-bottom-sheet.component.html'
})
export class ConfirmBottomSheetComponent {

  constructor(private bottomSheetRef: MatBottomSheetRef, @Inject(MAT_BOTTOM_SHEET_DATA) public data: { message: string } = { message: $localize`Are you sure?` }) { }

  close(result: boolean): void {
    this.bottomSheetRef.dismiss(result)
  }

}
