import { TestBed } from '@angular/core/testing';

import { PlayersService } from './players.service';

describe('PlayerserviceService', () => {
  let service: PlayersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
