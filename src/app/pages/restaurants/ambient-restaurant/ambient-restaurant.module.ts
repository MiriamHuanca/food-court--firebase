import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {SharedModule} from "../../../shared/shared.module";
import {AmbientRestaurantComponent} from "./ambient-restaurant.component";
import {SiteComponent} from "./site.component";
import {AgmCoreModule} from "@agm/core";
import {environment} from "../../../../environments/environment";
import {ReactiveFormsModule} from "@angular/forms";
import {NgbDatepickerModule, NgbModule} from "@ng-bootstrap/ng-bootstrap";

const routes: Routes = [
  {path: '', component: AmbientRestaurantComponent,}
];

@NgModule({
  declarations: [
    AmbientRestaurantComponent,
    SiteComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgbDatepickerModule,
    SharedModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKeyGoogleMap,
      libraries: ['geometry', 'places']
    })
  ]
})

export class AmbientRestaurantModule {
}
