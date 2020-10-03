import {NgModule} from '@angular/core';
import {PagesComponent} from './pages.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from "../shared/shared.module";
import {AuthService} from "../shared/services/auth.service";

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: 'restaurants', pathMatch: 'full'},
      {path: 'restaurants', loadChildren: () => import('./restaurants/restaurants.module').then(m => m.RestaurantsModule)},
      {path: 'foods', loadChildren: () => import('./foods/foods.module').then(m => m.FoodsModule)},
      {path: 'ambients', loadChildren: () => import('./ambients/ambients.module').then(m => m.AmbientsModule)},
      {path: 'bookings', loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsModule)},
      {path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)}
    ]
  }
];

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    AuthService
  ]
})

export class PagesModule {
}
