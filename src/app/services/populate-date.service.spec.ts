import { TestBed } from '@angular/core/testing';

import { PopulateDateService } from './populate-date.service';

describe('PopulateDateService', () => {
  let service: PopulateDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PopulateDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
