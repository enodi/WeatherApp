import { Component, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';

import { RestService } from '../rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  location: string = "";
  weatherData: any = [];
  @ViewChild("locationForm") locationForm: NgForm;

  constructor(public weatherService: RestService, private router: Router) { }

  onSubmit(locationForm: NgForm) {
    this.router.navigate(['/current-weather/' + this.location]);
  }
}
