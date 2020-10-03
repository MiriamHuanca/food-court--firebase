import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {HttpClientModule} from "@angular/common/http";
import {AmbientsComponent} from "./ambients.component";
import {SharedModule} from "../../shared/shared.module";

const routes: Routes = [
  {path: '', component: AmbientsComponent}
];

@NgModule({
  declarations: [
    AmbientsComponent
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

export class AmbientsModule {
}
