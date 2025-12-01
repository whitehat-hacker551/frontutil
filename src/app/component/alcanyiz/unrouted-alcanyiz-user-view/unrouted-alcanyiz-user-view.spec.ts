import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnroutedAlcanyizUserView } from './unrouted-alcanyiz-user-view';

describe('UnroutedAlcanyizUserView', () => {
  let component: UnroutedAlcanyizUserView;
  let fixture: ComponentFixture<UnroutedAlcanyizUserView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnroutedAlcanyizUserView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnroutedAlcanyizUserView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
