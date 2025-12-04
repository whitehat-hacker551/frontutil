import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizUserView } from './routed-alcanyiz-user-view';

describe('RoutedAlcanyizUserView', () => {
  let component: RoutedAlcanyizUserView;
  let fixture: ComponentFixture<RoutedAlcanyizUserView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizUserView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizUserView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
