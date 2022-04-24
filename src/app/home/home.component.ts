import { Component, OnInit } from '@angular/core'

import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-home',
  styles: [
    `
      div[fxLayout] {
        margin-top: 32px;
      }
    `,
  ],
  template: `
    <div fxLayout="column" fxLayoutAlign="center center">
      <span class="mat-display-2">Hello, Kelvin!</span>
      <button mat-raised-button color="primary" routerLink="/manager">
        Login as manager
      </button>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  login() {
    this.authService.login('manager@test.com', '12345678')
  }
}
