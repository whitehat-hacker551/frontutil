import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizAdminEdit } from './routed-alcanyiz-admin-edit';

describe('RoutedAlcanyizAdminEdit', () => {
  let component: RoutedAlcanyizAdminEdit;
  let fixture: ComponentFixture<RoutedAlcanyizAdminEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizAdminEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizAdminEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
