import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizGame } from './routed-alcanyiz-game';

describe('RoutedAlcanyizGame', () => {
  let component: RoutedAlcanyizGame;
  let fixture: ComponentFixture<RoutedAlcanyizGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizGame);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
