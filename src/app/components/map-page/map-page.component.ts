import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MatButton } from "@angular/material/button";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { PlaceAutocompleteComponent, PlaceSearchResult } from "../place-autocomplete/place-autocomplete.component";
import { PlaceCardComponent } from "../place-card/place-card.component";
import { MapService } from "../../services/map.service";
import { MapDisplayComponent } from "../map-display/map-display.component";
import { InputService } from "../../services/input.service";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {ScrollingModule} from "@angular/cdk/scrolling";

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    MatButton,
    NgForOf,
    PlaceAutocompleteComponent,
    PlaceCardComponent,
    MapDisplayComponent,
    NgIf,
    NgClass,
    MatSnackBarModule,
    ScrollingModule
  ],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'] // Fixed typo styleUrl -> styleUrls
})
export class MapPageComponent implements OnInit {

  places: PlaceSearchResult[] = [{ address: '' }, { address: '' }, { address: '' }];

  @ViewChild(MapDisplayComponent)
  private mapDisplayComponent!: MapDisplayComponent;

  constructor(private cdr: ChangeDetectorRef,
              private mapService: MapService,
              private inputService: InputService,
              private snackBar: MatSnackBar)
  {
  }

  ngOnInit(): void
  {
    //get places from sessionStorage so we dont lose data f.e. on page refresh
    const savedPlaces = sessionStorage.getItem('places');
    if (savedPlaces)
    {
      this.places = JSON.parse(savedPlaces);
    }
    this.inputService.inputCleared$.subscribe(clearedValueIndex  => {

      let emptyPlace : PlaceSearchResult = { address: '' };
      this.onPlaceChanged(emptyPlace, clearedValueIndex);
    });
  }

  addPlaceAutocomplete()
  {
    if (this.places.length > 1)
    {
      this.places.splice(this.places.length - 1, 0, { address: '' });
    }
    else
    {
      this.places.push({ address: '' });
    }
    this.updateSessionAndView();
  }

  removeLastPlaceAutocomplete()
  {
    if (this.places.length > 1)
    {
      this.places.splice(this.places.length - 2, 1);
      this.updateSessionAndView();
      this.mapDisplayComponent.calculateRoute();
    }

  }

  async optimizeRoute()
  {
    try
    {
      const addresses = this.places.map(place => place.address);
      const result = await this.mapService.optimizePath(addresses);

      //this.places = this.places.filter((place, index) => result[index]);
      console.log('places::: ');
      console.log(this.places);

      let newPlaces: PlaceSearchResult[] = [];
      for (let i = 0; i < result.length - 1; i++)
      {
        newPlaces.push(this.places[result[i]]);
      }

      if (newPlaces[0].address !== newPlaces[newPlaces.length - 1].address)
      {
        newPlaces.push(newPlaces[0]);
      }

      console.log('newPlaces::: ');
      console.log(newPlaces);

      this.places = newPlaces;
      this.refreshView();

      this.snackBar.open('Path has been optimized', 'Close', {
        duration: 3000,
        verticalPosition: 'bottom',
      });

    }
    catch (error)
    {
      console.error('Error optimizing route:', error);
    }

    //set places in sessionStorage, so we don't lose data when refreshing page in web browser
    sessionStorage.setItem('places', JSON.stringify(this.places));
  }

  onPlaceChanged(place: PlaceSearchResult, index: number)
  {
    this.places = [...this.places.slice(0, index), place, ...this.places.slice(index + 1)];
    // Ensure the last place is always the same as the first place
    if (this.places.length > 1)
    {
      this.places[this.places.length - 1] = { ...this.places[0] };
    }
    this.updateSessionAndView();
  }

  updateSessionAndView()
  {
    //set places in sessionStorage, so we don't lose data when refreshing page in web browser
    sessionStorage.setItem('places', JSON.stringify(this.places));
    this.refreshView();
  }

  refreshView()
  {
    this.cdr.detectChanges();
  }

}
