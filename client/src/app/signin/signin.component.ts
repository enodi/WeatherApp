import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService } from '../services/authentication.service';
import { TokenPayload } from '../interfaces/interfaces';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  model: any = {};
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  signin() {
    this.auth.signin(this.credentials).subscribe(() => {
      this.router.navigateByUrl("/home");
    }, (err) => {
      const errorMessage = err.error.message;
      if (errorMessage) return this.toastr.error(errorMessage);
      return new Error(err);
    });
  }

}
