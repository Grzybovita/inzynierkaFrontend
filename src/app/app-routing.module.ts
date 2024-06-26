import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {HelpPageComponent} from "./components/help-page/help-page.component";
import {MapPageComponent} from "./components/map-page/map-page.component";
import {RegisterPageComponent} from "./components/register-page/register-page.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {TokenComponent} from "./components/token/token.component";
import {ProfilePageComponent} from "./components/profile-page/profile-page.component";

const routes: Routes = [
  { path: '', redirectTo: '/map', pathMatch: 'full' },
  { path: 'map', component: MapPageComponent },
  { path: 'help', component: HelpPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'token/verify', component: TokenComponent },
  { path: 'profile', component: ProfilePageComponent },
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
