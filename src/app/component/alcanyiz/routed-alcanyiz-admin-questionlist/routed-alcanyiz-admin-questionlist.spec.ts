import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutedAlcanyizAdminQuestionlist } from './routed-alcanyiz-admin-questionlist';

describe('RoutedAlcanyizAdminQuestionlist', () => {
  let component: RoutedAlcanyizAdminQuestionlist;
  let fixture: ComponentFixture<RoutedAlcanyizAdminQuestionlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutedAlcanyizAdminQuestionlist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutedAlcanyizAdminQuestionlist);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
