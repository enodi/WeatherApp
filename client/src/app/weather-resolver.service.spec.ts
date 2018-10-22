import { TestBed } from '@angular/core/testing';

import { WeatherResolverService } from './weather-resolver.service';

describe('WeatherResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherResolverService = TestBed.get(WeatherResolverService);
    expect(service).toBeTruthy();
  });
});
