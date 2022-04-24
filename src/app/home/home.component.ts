import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { combineLatest, filter, tap } from 'rxjs'

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
      <button mat-raised-button color="primary" (click)="login()">
        Login as manager
      </button>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}
  login() {
    this.authService.login('manager@test.com', '12345678')
    combineLatest([this.authService.authStatus$, this.authService.currentUser$])
      .pipe(
        filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
        tap(([authStatus, user]) => {
          this.router.navigate(['/manager'])
        })
      )
      .subscribe()
  }
}
