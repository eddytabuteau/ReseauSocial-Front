import { TestBed } from '@angular/core/testing';

import { LogGuardsGuard } from './log-guards.guard';

describe('LogGuardsGuard', () => {
  let guard: LogGuardsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LogGuardsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
