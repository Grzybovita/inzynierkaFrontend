import {ChangeDetectorRef, Component} from '@angular/core';
import { PlaceSearchResult } from "./components/place-autocomplete/place-autocomplete.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inzynierkaFrontend';
  places: PlaceSearchResult[] = [{ address: '' }, { address: '' }];

  constructor(private cdr: ChangeDetectorRef) {}
  addPlaceAutocomplete()
  {
    this.places.push({ address: '' });
  }

  removeLastPlaceAutocomplete()
  {
    this.places = this.places.slice(0, -1);
    this.refreshView();
  }

  onPlaceChanged(place: PlaceSearchResult, index: number)
  {
    console.log('Place changed:', place);
    this.places = [...this.places.slice(0, index), place, ...this.places.slice(index + 1)];
    this.refreshView();
  }

  refreshView()
  {
    this.cdr.detectChanges(); // Manually trigger change detection
  }

}
