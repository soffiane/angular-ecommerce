import { TestBed } from '@angular/core/testing';

import { CreditCardDate } from './credit-card-date';

describe('CreditCardDate', () => {
  let service: CreditCardDate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditCardDate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
