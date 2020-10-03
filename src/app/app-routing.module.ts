import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from "./shared/guards/auth.guard";
import {PagesComponent} from "./pages/pages.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'session',
    loadChildren: () => import('./pages/session/session.module').then(m => m.SessionModule)
  },
  {path: '**', redirectTo: 'session/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
