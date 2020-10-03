import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {HomeComponent} from "./home.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AgmCoreModule} from "@agm/core";
import {environment} from "../../../../environments/environment";
import {HttpClientModule} from "@angular/common/http";

const routes: Routes = [
  {path: '', component: HomeComponent,}
];

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    HttpClientModule,
    NgbDatepickerModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKeyGoogleMap,
      libraries: ['geometry', 'places']
    }),
  ],
  providers: [],
  entryComponents: [
  ]
})

export class HomeModule {
}
