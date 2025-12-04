import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PallasRemove } from './pallas-remove';

describe('PallasRemove', () => {
  let component: PallasRemove;
  let fixture: ComponentFixture<PallasRemove>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PallasRemove]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PallasRemove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
