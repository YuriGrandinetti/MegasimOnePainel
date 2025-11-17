import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMembershipsList } from './tenant-memberships-list';

describe('TenantMembershipsList', () => {
  let component: TenantMembershipsList;
  let fixture: ComponentFixture<TenantMembershipsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantMembershipsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantMembershipsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
