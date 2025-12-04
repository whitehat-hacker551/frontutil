import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PallasPlist } from './pallas-plist';

describe('PallasPlist', () => {
  let component: PallasPlist;
  let fixture: ComponentFixture<PallasPlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PallasPlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PallasPlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
