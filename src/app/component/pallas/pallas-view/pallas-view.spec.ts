import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PallasView } from './pallas-view';

describe('PallasView', () => {
  let component: PallasView;
  let fixture: ComponentFixture<PallasView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PallasView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PallasView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
