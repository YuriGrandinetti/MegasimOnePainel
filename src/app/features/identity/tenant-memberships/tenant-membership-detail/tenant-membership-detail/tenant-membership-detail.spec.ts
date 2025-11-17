import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantMembershipDetail } from './tenant-membership-detail';

describe('TenantMembershipDetail', () => {
  let component: TenantMembershipDetail;
  let fixture: ComponentFixture<TenantMembershipDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantMembershipDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantMembershipDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
