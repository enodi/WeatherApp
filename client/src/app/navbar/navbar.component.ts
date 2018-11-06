import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { RestService } from '../services/rest.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  location: string = "";
  weatherData: any = [];
  @ViewChild("locationForm") locationForm: NgForm;

  constructor(private auth: AuthenticationService, public weatherService: RestService, private router: Router) { }

  onSubmit(locationForm: NgForm) {
    this.router.navigate(['/current-weather/' + this.location]);
  }
}
