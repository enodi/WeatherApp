import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenResponse, UserDetails, TokenPayload, Token } from '../interfaces/interfaces';

// interface TokenResponse {
//   token: string;
// }

// export interface UserDetails {
//   _id: string;
//   name: string;
//   exp: number;
// }

// export interface Token {
//   token: string;
// }

// export interface TokenPayload {
//   name?: string;
//   email: string;
//   password: string;
// }

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) { }

  private saveToken(token: string): void {
    localStorage.setItem("token", token);
    this.token = token;
  }

  public getToken(): string {
    if (!this.token) return this.token = localStorage.getItem("token");
    return this.token;
  }

  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("token");
    this.router.navigateByUrl("/");
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    }
    return false;
  }

  private request(method: "post", type: "signin" | "signup", user?: TokenPayload): Observable<any> {
    let base;

    if (method === "post") {
      base = this.http.post(`https://weather-app-angular-node.herokuapp.com/api/v1/${type}`, user);
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public signup(user: TokenPayload): Observable<any> {
    return this.request("post", "signup", user);
  }

  public signin(user: TokenPayload): Observable<any> {
    return this.request("post", "signin", user);
  }
}
