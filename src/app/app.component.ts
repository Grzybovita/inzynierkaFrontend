import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {
  PlaceAutocompleteComponent,
  PlaceSearchResult
} from "./components/place-autocomplete/place-autocomplete.component";
import {MatToolbarModule} from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inzynierkaFrontend';
  fromValue: PlaceSearchResult = { address: '' };
  toValue: PlaceSearchResult = { address: '' };
}
