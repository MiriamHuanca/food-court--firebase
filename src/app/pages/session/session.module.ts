import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SessionRoutes } from './session.routing';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SessionRoutes),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NotFoundComponent,
    ErrorComponent,
  ]
})

export class SessionModule {}
