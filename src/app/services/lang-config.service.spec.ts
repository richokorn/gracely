import { TestBed } from '@angular/core/testing';

import { LangConfigService } from './lang-config.service';

describe('LangConfigService', () => {
  let service: LangConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
