import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourt } from './add-court';

describe('AddCourt', () => {
  let component: AddCourt;
  let fixture: ComponentFixture<AddCourt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourt],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCourt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
