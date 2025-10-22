import { TestBed } from '@angular/core/testing';

import { UserRegisterStateService } from './user-register-state.service';

describe('UserRegisterStateService', () => {
  let service: UserRegisterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRegisterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
