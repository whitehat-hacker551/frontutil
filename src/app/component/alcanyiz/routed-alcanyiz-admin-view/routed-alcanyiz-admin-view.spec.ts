import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizAdminView } from './routed-alcanyiz-admin-view';

describe('RoutedAlcanyizAdminView', () => {
  let component: RoutedAlcanyizAdminView;
  let fixture: ComponentFixture<RoutedAlcanyizAdminView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizAdminView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizAdminView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
