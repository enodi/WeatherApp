/// <reference types="@types/googlemaps" />
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('gmap') gmapElement: any;

  ngAfterContentInit() {
    let map;
    let geoJSON;
    let request;
    let gettingData = false;
    let openWeatherMapKey = "1136aabf0094957684fcaa78c0fd0cd6"

    let mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(50, -50)
    };
    let checkIfDataRequested = function () {

      while (gettingData === true) {
        request.abort();
        gettingData = false;
      }
      getCoords();
    };
    map = new google.maps.Map(this.gmapElement.nativeElement, mapOptions);

    google.maps.event.addListener(map, 'idle', checkIfDataRequested);

    map.data.addListener('click', function (event) {
      infowindow.setContent(
        "<img src=" + event.feature.getProperty("icon") + ">"
        + "<br /><strong>" + event.feature.getProperty("city") + "</strong>"
        + "<br />" + event.feature.getProperty("temperature") + "&deg;C"
        + "<br />" + event.feature.getProperty("weather")
      );

      infowindow.open(map);
    });

    let getCoords = function () {
      let bounds = map.getBounds();
      let NE = bounds.getNorthEast();
      let SW = bounds.getSouthWest();
      getWeather(NE.lat(), NE.lng(), SW.lat(), SW.lng());
    };

    let getWeather = function (northLat, eastLng, southLat, westLng) {
      gettingData = true;
      let requestString = "http://api.openweathermap.org/data/2.5/box/city?bbox="
        + westLng + "," + northLat + ","
        + eastLng + "," + southLat + ","
        + map.getZoom()
        + "&cluster=yes&format=json"
        + "&APPID=" + openWeatherMapKey;
      request = new XMLHttpRequest();
      request.onload = proccessResults;
      request.open("get", requestString, true);
      request.send();
    };
    let proccessResults = function () {
      let results = JSON.parse(this.responseText);
      if (results.list.length > 0) {
        resetData();
        for (let i = 0; i < results.list.length; i++) {
          geoJSON.features.push(jsonToGeoJson(results.list[i]));
        }
        drawIcons(geoJSON);
      }
    };
    let infowindow = new google.maps.InfoWindow();
    let jsonToGeoJson = function (weatherItem) {
      let feature = {
        type: "Feature",
        properties: {
          city: weatherItem.name,
          weather: weatherItem.weather[0].main,
          temperature: weatherItem.main.temp,
          min: weatherItem.main.temp_min,
          max: weatherItem.main.temp_max,
          humidity: weatherItem.main.humidity,
          pressure: weatherItem.main.pressure,
          windSpeed: weatherItem.wind.speed,
          windDegrees: weatherItem.wind.deg,
          windGust: weatherItem.wind.gust,
          icon: "http://openweathermap.org/img/w/"
            + weatherItem.weather[0].icon + ".png",
          coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
        },
        geometry: {
          type: "Point",
          coordinates: [weatherItem.coord.Lon, weatherItem.coord.Lat]
        }
      };
      map.data.setStyle(function (feature) {
        return {
          icon: {
            url: feature.getProperty('icon'),
            anchor: new google.maps.Point(25, 25)
          }
        };
      });
      return feature;
    };
    let drawIcons = function (weather) {
      map.data.addGeoJson(geoJSON);

      gettingData = false;
    };

    let resetData = function () {
      geoJSON = {
        type: "FeatureCollection",
        features: []
      };
      map.data.forEach(function (feature) {
        map.data.remove(feature);
      });
    };
  }
}
