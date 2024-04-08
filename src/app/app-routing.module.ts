import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HelpPageComponent} from "./components/help-page/help-page.component";
import {MapPageComponent} from "./components/map-page/map-page.component";

const routes: Routes = [
  { path: 'map', component: MapPageComponent },
  { path: 'help', component: HelpPageComponent },
  // Other routes...
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
