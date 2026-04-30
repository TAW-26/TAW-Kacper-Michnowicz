import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDetails } from './court-details';

describe('CourtDetails', () => {
  let component: CourtDetails;
  let fixture: ComponentFixture<CourtDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
