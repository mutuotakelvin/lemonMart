import { Injectable } from '@angular/core'
import jwt_decode from 'jwt-decode'
import {
  BehaviorSubject,
  Observable,
  catchError,
  filter,
  flatMap,
  map,
  pipe,
  tap,
  throwError,
} from 'rxjs'

import { transformError } from '../common/common'
import { IUser, User } from '../user/user/user'
import { Role } from './auth.enum'
import { CacheService } from './cache.service'

export interface IAuthStatus {
  isAuthenticated: boolean
  userRole: Role
  userId: string
}

export interface IServerAuthResponse {
  accessToken: string
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
}

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>
  readonly currentUser$: BehaviorSubject<IUser>
  login(email: string, password: string): Observable<void>
  logout(clearToken?: boolean): void
  getToken(): string
}
@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>
  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentUser(): Observable<User>

  constructor() {
    super()
    if (this.hasExpiredToken()) {
      this.logout(true)
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken())
    }
  }
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus)
  readonly currentUser$ = new BehaviorSubject<IUser>(new User())

  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    flatMap(() => this.getCurrentUser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  )

  login(email: string, password: string): Observable<void> {
    this.clearToken()
    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        this.setToken(value.accessToken)
        const token = jwt_decode(value.accessToken)
        return this.transformJwtToken(token)
      }),
      tap((status) => this.authStatus$.next(status)),
      this.getAndUpdateUserIfAuthenticated
    )
    loginResponse$.subscribe({
      error: (err) => {
        this.logout()
        return throwError(err)
      },
    })
    return loginResponse$
  }
  logout(clearToken?: boolean) {
    if (clearToken) {
      this.clearToken()
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0)
  }
  getToken(): string {
    return this.getItem('jwt') ?? ''
  }
  protected setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }
  protected clearToken() {
    this.removeItem('jwt')
  }

  protected hasExpiredToken(): boolean {
    const jwt = this.getToken()
    if (jwt) {
      const payload = jwt_decode(jwt) as any
      return Date.now() >= payload.exp * 1000
    }
    return true
  }

  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(jwt_decode(this.getToken()))
  }

  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateUserIfAuthenticated
  )
}
