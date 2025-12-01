import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizAdminRemove } from './routed-alcanyiz-admin-remove';

describe('RoutedAlcanyizAdminRemove', () => {
  let component: RoutedAlcanyizAdminRemove;
  let fixture: ComponentFixture<RoutedAlcanyizAdminRemove>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizAdminRemove]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizAdminRemove);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
