import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {PlaceAutocompleteComponent, PlaceSearchResult} from "../place-autocomplete/place-autocomplete.component";
import {PlaceCardComponent} from "../place-card/place-card.component";
import {MapService} from "../../services/map.service";
import {MapDisplayComponent} from "../map-display/map-display.component";
import {InputService} from "../../services/input.service";

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    MatButton,
    NgForOf,
    PlaceAutocompleteComponent,
    PlaceCardComponent,
    MapDisplayComponent
  ],
  templateUrl: './map-page.component.html',
  styleUrl: './map-page.component.css'
})
export class MapPageComponent implements OnInit {

  places: PlaceSearchResult[] = [{ address: '' }, { address: '' }];

  constructor(private cdr: ChangeDetectorRef,
              private mapService: MapService,
              private inputService: InputService) {
  }

  ngOnInit(): void
  {
    this.inputService.inputCleared$.subscribe(clearedValueIndex  => {

      let emptyPlace : PlaceSearchResult = { address: '' };
      this.onPlaceChanged(emptyPlace, clearedValueIndex);
    });
  }

  addPlaceAutocomplete()
  {
    this.places.push({ address: '' });
  }

  removeLastPlaceAutocomplete()
  {
    this.places = this.places.slice(0, -1);
    this.refreshView();
  }

  async optimizeRoute()
  {
    try
    {
      const addresses = this.places.map(place => place.address);
      const result = await this.mapService.optimizePath(addresses);
      console.log('places::: ');
      console.log(this.places);

      let newPlaces: PlaceSearchResult[] = [];
      for (let i = 0; i < result.length - 1; i++)
      {
        newPlaces.push(this.places[result[i]]);
      }

      console.log('newPlaces::: ');
      console.log(newPlaces);

      this.places = newPlaces;
      this.refreshView();
    }
    catch (error)
    {
      console.error('Error optimizing route:', error);
    }
  }

  onPlaceChanged(place: PlaceSearchResult, index: number)
  {
    this.places = [...this.places.slice(0, index), place, ...this.places.slice(index + 1)];
    this.refreshView();
  }

  refreshView()
  {
    this.cdr.detectChanges(); // Manually trigger change detection
  }

}
