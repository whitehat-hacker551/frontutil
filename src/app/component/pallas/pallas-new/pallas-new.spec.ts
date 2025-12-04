import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PallasNew } from './pallas-new';

describe('PallasNew', () => {
  let component: PallasNew;
  let fixture: ComponentFixture<PallasNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PallasNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PallasNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
