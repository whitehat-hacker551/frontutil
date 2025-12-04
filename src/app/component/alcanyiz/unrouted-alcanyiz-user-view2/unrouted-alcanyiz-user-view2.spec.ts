import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnroutedAlcanyizUserView2 } from './unrouted-alcanyiz-user-view2';

describe('UnroutedAlcanyizUserView2', () => {
  let component: UnroutedAlcanyizUserView2;
  let fixture: ComponentFixture<UnroutedAlcanyizUserView2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnroutedAlcanyizUserView2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnroutedAlcanyizUserView2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
