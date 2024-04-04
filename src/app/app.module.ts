import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapDisplayComponent } from './components/map-display/map-display.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbar} from "@angular/material/toolbar";
import {PlaceAutocompleteComponent} from "./components/place-autocomplete/place-autocomplete.component";
import {GoogleMap, MapDirectionsRenderer, MapMarker} from "@angular/google-maps";
import {PlaceCardComponent} from "./components/place-card/place-card.component";
import {MatButton} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    MapDisplayComponent
  ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbar,
        PlaceAutocompleteComponent,
        GoogleMap,
        MapDirectionsRenderer,
        MapMarker,
        PlaceCardComponent,
        MatButton,
        HttpClientModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
