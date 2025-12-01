import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnroutedAlcanyizAdminView } from './unrouted-alcanyiz-admin-view';

describe('UnroutedAlcanyizAdminView', () => {
  let component: UnroutedAlcanyizAdminView;
  let fixture: ComponentFixture<UnroutedAlcanyizAdminView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnroutedAlcanyizAdminView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnroutedAlcanyizAdminView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
