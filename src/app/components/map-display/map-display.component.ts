import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {GoogleMap, MapDirectionsRenderer, MapDirectionsService, MapMarker} from "@angular/google-maps";
import {PlaceAutocompleteComponent, PlaceSearchResult} from "../place-autocomplete/place-autocomplete.component";
import {BehaviorSubject, map} from "rxjs";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {animate, AUTO_STYLE, state, style, transition, trigger} from "@angular/animations";
import {MapSettingsCardComponent} from "../map-settings-card/map-settings-card.component";
import {MapService} from "../../services/map.service";
import {MapDetailsCardComponent} from "../map-details-card/map-details-card.component";

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-map-display',
  standalone: true,
  templateUrl: './map-display.component.html',
  imports: [
    GoogleMap,
    MapDirectionsRenderer,
    MapMarker,
    NgIf,
    NgForOf,
    CommonModule,
    MatButton,
    PlaceAutocompleteComponent,
    MapSettingsCardComponent,
    MapDetailsCardComponent
  ],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ],
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit, OnChanges
{
  @ViewChild('map', { static: true })
  map!: GoogleMap;

  @Input()
  places: PlaceSearchResult[] = [];

  showSettings: boolean = false;
  showDetails: boolean = false;
  markerPositions: google.maps.LatLng[] = [];
  zoom = 5;

  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  @Output()
  directionsResultChanged = new EventEmitter<google.maps.DirectionsResult>();

  selectedTravelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING;
  selectedDepartureTime: number = Date.now();

  constructor(private directionsService: MapDirectionsService,
              private mapService: MapService) {}

  ngOnInit(): void
  {

  }

  ngOnChanges()
  {
    if (this.places.length >= 2)
    {
      this.calculateRoute();
    }
  }

  calculateRoute()
  {
    this.updateSettingsFromSessionStorage();

    this.places = this.places.filter(place => place.address && place.address.trim() !== '');

    const fromLocation = this.places[0]?.location;
    const toLocation = this.places[this.places.length - 1]?.location;
    const waypoints = this.places.slice(1, -1).map(place => place.location);

    if (fromLocation && toLocation)
    {
      console.log('travelmode: ', this.selectedTravelMode);
      console.log('departuretime: ', new Date(this.selectedDepartureTime));
      const request: google.maps.DirectionsRequest = {
        destination: toLocation,
        origin: fromLocation,
        waypoints: waypoints.map(waypoint => ({location: waypoint, stopover: true})),
        /* optimizeWaypoints: true,*/
        travelMode: this.selectedTravelMode,
        drivingOptions: { departureTime : new Date(this.selectedDepartureTime) },
      };

      this.directionsService
        .route(request)
        .pipe(map((response) => response.result))
        .subscribe((res) => {
          this.directionsResult$.next(res);
          this.markerPositions = [];
        });
    }
    else if (fromLocation)
    {
      this.gotoLocation(fromLocation);
    }
  }

  private updateSettingsFromSessionStorage()
  {
    const savedTravelMode = sessionStorage.getItem('selectedTravelMode');
    if (savedTravelMode)
    {
      this.selectedTravelMode = JSON.parse(savedTravelMode);
    }

    const savedDepartureTime = sessionStorage.getItem('selectedDepartureTime');
    if (savedDepartureTime)
    {
      this.selectedDepartureTime = JSON.parse(savedDepartureTime);
    }
  }

  gotoLocation(location: google.maps.LatLng)
  {
    this.markerPositions = [location];
    this.map.panTo(location);
    this.zoom = 10;
    this.directionsResult$.next(undefined);
  }

  toggleSettings()
  {
    this.showSettings = !this.showSettings;
  }

  toggleDetails()
  {
    this.showDetails = !this.showDetails;
  }

  onSelectedTravelModeChange(selectedTravelMode: string)
  {
    if (selectedTravelMode !== this.selectedTravelMode)
    {
      this.selectedTravelMode = this.mapService.parseSelectedTravelMode(selectedTravelMode);
      sessionStorage.setItem('selectedTravelMode', JSON.stringify(this.selectedTravelMode.valueOf()));
      this.calculateRoute();
    }
  }

  onSelectedDepartureTimeChange(selectedDepartureTime: number)
  {
    if (selectedDepartureTime !== this.selectedDepartureTime)
    {
      this.selectedDepartureTime = selectedDepartureTime;
      sessionStorage.setItem('selectedDepartureTime', JSON.stringify(this.selectedDepartureTime));
      this.calculateRoute();
    }
  }

}
