import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizAdminCreate } from './routed-alcanyiz-admin-create';

describe('RoutedAlcanyizAdminCreate', () => {
  let component: RoutedAlcanyizAdminCreate;
  let fixture: ComponentFixture<RoutedAlcanyizAdminCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizAdminCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizAdminCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
