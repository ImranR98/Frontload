import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpModalComponent } from './otp-modal.component';

describe('OtpModalComponent', () => {
  let component: OtpModalComponent;
  let fixture: ComponentFixture<OtpModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtpModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
