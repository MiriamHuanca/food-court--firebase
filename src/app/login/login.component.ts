import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthResponseData, AuthService} from '../shared/services/auth.service';
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";
import Swal from 'sweetalert2';

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  email = 'mairim.acnauh@yahoo.es';
  password = 'asdasd';

  isLoginMode = true;
  isLoading = false;

  constructor(private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    if (this.authService.verifyLogged()) {
      this.router.navigate(['pages']);
    }
  }

  signInWithFB(){}

  signInWithTwitter(){}

  signInWithGoogle(){}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['pages']);
      },
      errorMessage => {
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  private showErrorAlert(message: string) {
    Swal.fire({
      title: message,
      text: 'Quieres continuar?',
      icon: 'error',
      confirmButtonText: 'Continuar'
    })
  }

}
