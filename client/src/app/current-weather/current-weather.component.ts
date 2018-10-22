import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css']
})
export class CurrentWeatherComponent implements OnInit {
  data: any;
  errorMessage: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.data = this.route.snapshot.data;
    this.errorMessage = this.route.snapshot.data.weatherData.data.message;
  }
}
