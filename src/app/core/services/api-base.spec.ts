import { TestBed } from '@angular/core/testing';

import { ApiBase } from './api-base';

describe('ApiBase', () => {
  let service: ApiBase;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBase);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
