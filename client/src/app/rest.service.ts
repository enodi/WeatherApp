import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthenticationService } from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class RestService {
  constructor(private http: HttpClient, private auth: AuthenticationService) { }

  getForecast(location: string) {
    return this.http.get(`https://weather-app-angular-node.herokuapp.com/api/v1/search-location?location=${location}`, { headers: { "x-access-token": `${this.auth.getToken()}` } })
      .toPromise()
  }
}
