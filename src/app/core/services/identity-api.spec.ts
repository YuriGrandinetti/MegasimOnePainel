import { TestBed } from '@angular/core/testing';

import { IdentityApi } from './identity-api';

describe('IdentityApi', () => {
  let service: IdentityApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentityApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
