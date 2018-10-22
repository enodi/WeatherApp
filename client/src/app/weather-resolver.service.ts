import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherResolverService {
  constructor(private weatherService: RestService, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    let location = route.paramMap.get('location');
    return this.weatherService.getForecast(location)
      .then((data) => {
        return data;
      });
  }
}
