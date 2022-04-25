import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { catchError, combineLatest, filter, tap } from 'rxjs'
import { SubSink } from 'subsink'

import { AuthService } from '../auth/auth.service'

@Component({
  selector: 'app-login',
  template: `
    <div fxLayout="row" fxLayoutAlign="center">
      <mat-card fxFlex="400px">
        <mat-card-header>
          <mat-card-title>
            <div class="mat-headline">Hello, Kelvin!</div>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="login(loginForm)" fxLayout="column">
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
              <mat-icon>email</mat-icon>
              <mat-form-field fxFlex>
                <input
                  matInput
                  placeholder="E-mail"
                  aria-label="E- mail"
                  formControlName="email"
                />
                <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                  E-mail is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                  E-mail is not valid
                </mat-error>
              </mat-form-field>
            </div>
            <div fxLayout="row" fxLayoutAlign="start center" fxLayoutGap="10px">
              <mat-icon matPrefix>vpn_key</mat-icon>
              <mat-form-field fxFlex>
                <input
                  matInput
                  placeholder="Password"
                  aria-
                  label="Password"
                  type="password"
                  formControlName="password"
                />
                <mat-hint>Minimum 8 characters</mat-hint>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                  Password is at least 8 characters long
                </mat-error>
                <mat-error *ngIf="loginForm.get('password')?.hasError('maxlength')">
                  Password cannot be longer than 50 characters
                </mat-error>
              </mat-form-field>
            </div>
            <div fxLayout="row" class="margin-top">
              <div *ngIf="loginError" class="mat-caption error">{{ loginError }}</div>
              <div class="flex-spacer"></div>
              <button
                mat-raised-button
                type="submit"
                color="primary"
                [disabled]="loginForm.invalid"
              >
                Login
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .error {
        color: red;
      }
    `,
    `
      div[fxLayout] {
        margin-top: 32px;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  private subs = new SubSink()
  loginForm!: FormGroup
  loginError = ''
  redirectUrl!: string

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(50)],
      ],
    })
  }
  async login(submittedForm: FormGroup) {
    this.authService
      .login(submittedForm.value.email, submittedForm.value.password)
      .pipe(catchError((err) => (this.loginError = err)))
    this.subs.sink = combineLatest([
      this.authService.authStatus$,
      this.authService.currentUser$,
    ])
      .pipe(
        filter(([authStatus, user]) => authStatus.isAuthenticated && user?._id !== ''),
        tap(([authStatus, user]) => {
          this.router.navigate([this.redirectUrl || '/manager'])
        })
      )
      .subscribe()
  }

  ngOnInit(): void {}
}