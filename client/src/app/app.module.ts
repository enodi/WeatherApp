import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { NavbarComponent } from './navbar/navbar.component';

import { RestService } from './rest.service';
import { WeatherResolverService } from './weather-resolver.service';
import { AuthenticationService } from './authentication.service';
import { AuthorizationService } from './authorization.service';

const appRoutes: Routes = [
  {
    path: 'current-weather/:location',
    component: CurrentWeatherComponent,
    canActivate: [AuthorizationService],
    data: { title: 'Current Weather' },
    resolve: { weatherData: WeatherResolverService }
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthorizationService],
    data: { title: 'Home Page' }
  },
  {
    path: '',
    component: SignupComponent,
    data: { title: 'Signup Page' }
  },
  {
    path: 'signin',
    component: SigninComponent,
    data: { title: 'Signin Page' }
  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CurrentWeatherComponent,
    PageNotFoundComponent,
    SignupComponent,
    SigninComponent,
    NavbarComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    RestService,
    WeatherResolverService,
    AuthenticationService,
    AuthorizationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
