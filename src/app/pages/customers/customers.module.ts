import {NgModule} from '@angular/core';
import {CustomersComponent} from './customers.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from "../../shared/shared.module";

const routes: Routes = [
  {path: '', component: CustomersComponent}
];

@NgModule({
  declarations: [
    CustomersComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ]
})

export class CustomersModule {
}
