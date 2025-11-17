import { TestBed } from '@angular/core/testing';

import { TenantMembership } from './tenant-membership';

describe('TenantMembership', () => {
  let service: TenantMembership;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TenantMembership);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
