import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizMenu } from './routed-alcanyiz-menu';

describe('RoutedAlcanyizMenu', () => {
  let component: RoutedAlcanyizMenu;
  let fixture: ComponentFixture<RoutedAlcanyizMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
