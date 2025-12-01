import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizUserList } from './routed-alcanyiz-user-list';

describe('RoutedAlcanyizUserList', () => {
  let component: RoutedAlcanyizUserList;
  let fixture: ComponentFixture<RoutedAlcanyizUserList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizUserList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizUserList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
