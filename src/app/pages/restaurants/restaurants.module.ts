import {NgModule} from '@angular/core';

import {RestaurantsComponent} from './restaurants.component';
import {RouterModule, Routes} from '@angular/router';
import {RestaurantService} from '../../shared/services/restaurant.service';
import {SharedModule} from "../../shared/shared.module";

const routes: Routes = [
  {
    path: '',
    component: RestaurantsComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'detail/:id',
        loadChildren: () => import('./detail-restaurant/detail-restaurant.module').then(m => m.DetailRestaurantModule)
      },
      {
        path: 'ambient/:id',
        loadChildren: () => import('./ambient-restaurant/ambient-restaurant.module').then(m => m.AmbientRestaurantModule)
      },
    ]
  },
];

@NgModule({
  declarations: [
    RestaurantsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [
    RestaurantService
  ]
})

export class RestaurantsModule {
}
