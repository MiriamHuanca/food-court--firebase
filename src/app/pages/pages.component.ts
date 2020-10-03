import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  templateUrl: './pages.component.html'
})

export class PagesComponent implements OnInit {
  emailUser: string;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.emailUser = this.authService.getEmail() || 'Mairim';
  }

  public onLogout(): void {
    this.authService.logout();
  }

}
