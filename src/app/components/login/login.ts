import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}

  loginWithPopup(): void {
    this.auth.loginWithPopup();
  }

}
