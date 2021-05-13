import { TestBed } from '@angular/core/testing';

import { CheckoutFormService } from './checkoutform.service';

describe('PopulateDateService', () => {
  let service: CheckoutFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
