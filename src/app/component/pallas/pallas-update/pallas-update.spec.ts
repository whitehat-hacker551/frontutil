import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PallasUpdate } from './pallas-update';

describe('PallasUpdate', () => {
  let component: PallasUpdate;
  let fixture: ComponentFixture<PallasUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PallasUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PallasUpdate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
