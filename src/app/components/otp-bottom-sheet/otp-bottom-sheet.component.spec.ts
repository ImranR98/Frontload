import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpBottomSheetComponent } from './otp-bottom-sheet.component';

describe('OtpBottomSheetComponent', () => {
  let component: OtpBottomSheetComponent;
  let fixture: ComponentFixture<OtpBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
