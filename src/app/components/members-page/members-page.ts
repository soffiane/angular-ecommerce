import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Login } from '../login/login';

@Component({
  selector: 'app-members-page',
  standalone: false,
  templateUrl: './members-page.html',
  styleUrl: './members-page.css'
})
export class MembersPage implements OnInit{


  isAuthenticated: boolean = false;

  constructor(private auth : AuthService) {}

   ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
      this.isAuthenticated = authenticated;
    });
  }

  loginWithPopup() {
    this.auth.loginWithPopup();
  }

}
