import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {AuthService} from './shared/services/auth.service';
import {AuthGuard} from './shared/guards/auth.guard';
import {AuthInterceptor} from './shared/interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {AngularFireStorageModule, BUCKET} from "@angular/fire/storage";
import {RestaurantService} from "./shared/services/restaurant.service";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireStorageModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    RestaurantService,
    {provide: BUCKET, useValue: 'gs://ng-store-recipe-book.appspot.com'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
