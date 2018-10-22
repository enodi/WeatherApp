import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthenticationService, TokenPayload } from '../authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  credentials: TokenPayload = {
    name: '',
    email: '',
    password: ''
  };

  model: any = {};

  constructor(private auth: AuthenticationService, private router: Router, private toastr: ToastrService) { }

  signup() {
    this.auth.signup(this.credentials).subscribe(() => {
      this.router.navigateByUrl("/home");
    }, (err) => {
      const errorMessage = err.error.message;
      if (errorMessage) return this.toastr.error(errorMessage);
      return new Error(err);
    });
  }
}
