import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {SharedModule} from "../../shared/shared.module";
import {FoodsComponent} from "./foods.component";

const routes: Routes = [
  {path: '', component: FoodsComponent}
];

@NgModule({
  declarations: [
    FoodsComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    HttpClientModule,
    NgbDatepickerModule,
    SharedModule
  ],
  providers: [],
  entryComponents: [
  ]
})

export class FoodsModule {
}
