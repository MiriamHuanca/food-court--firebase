import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
  {path: '', component: LoginComponent}
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})

export class LoginModule {
}
