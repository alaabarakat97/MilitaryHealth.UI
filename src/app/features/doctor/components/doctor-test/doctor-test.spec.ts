import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorTest } from './doctor-test';

describe('DoctorTest', () => {
  let component: DoctorTest;
  let fixture: ComponentFixture<DoctorTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorTest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
