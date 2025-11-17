import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantSwitcher } from './tenant-switcher';

describe('TenantSwitcher', () => {
  let component: TenantSwitcher;
  let fixture: ComponentFixture<TenantSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantSwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
