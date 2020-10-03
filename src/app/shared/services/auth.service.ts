import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {BehaviorSubject, throwError} from 'rxjs';

import {environment} from "../../../environments/environment";
import {User} from "../models/user.model";
import {catchError, tap} from "rxjs/operators";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  url = environment.firebaseConfig.apiBaseUrl;
  key = environment.firebaseConfig.apiKey;

  constructor(private http: HttpClient,
              private router: Router) {

  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.url + ':signUp?key=' + this.key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handlieError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      this.url + ':signInWithPassword?key=' + this.key,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )
      .pipe(
        catchError(this.handlieError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(
      new Date().getTime() + expiresIn * 1000
    );
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public getEmail(): string {
    return localStorage.getItem('email');
  }

  public verifyLogged(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['login']);
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  private handlieError(errorRes: HttpErrorResponse) {
    let errorMessage = '¡Un error desconocido ocurrió!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'Este correo electrónico no encontrado';
        break;
      case 'EMAIL_EXISTS':
        errorMessage = 'Este correo electrónico no existe rotura.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Esta contraseña no es correcta.';
        break;
    }
    return throwError(errorMessage);
  }

}
