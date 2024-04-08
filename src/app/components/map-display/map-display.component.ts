import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapDirectionsRenderer, MapDirectionsService, MapMarker} from "@angular/google-maps";
import {PlaceSearchResult} from "../place-autocomplete/place-autocomplete.component";
import {BehaviorSubject, map} from "rxjs";
import {CommonModule, NgForOf, NgIf} from "@angular/common";

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
    CommonModule
  ],
  styleUrls: ['./map-display.component.css']
})
export class MapDisplayComponent implements OnInit, OnChanges
{
  @ViewChild('map', { static: true })
  map!: GoogleMap;

  @Input()
  places: PlaceSearchResult[] = [];

  markerPositions: google.maps.LatLng[] = [];

  zoom = 5;

  directionsResult$ = new BehaviorSubject<
    google.maps.DirectionsResult | undefined
  >(undefined);

  constructor(private directionsService: MapDirectionsService) {}

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

  async calculateRoute()
  {
    const fromLocation = this.places[0]?.location;
    const toLocation = this.places[this.places.length - 1]?.location;
    const waypoints = this.places.slice(1, -1).map(place => place.location);

    if (fromLocation && toLocation)
    {
      const request: google.maps.DirectionsRequest = {
        destination: toLocation,
        origin: fromLocation,
        waypoints: waypoints.map(waypoint => ({location: waypoint, stopover: true})),
        /* optimizeWaypoints: true,*/
        travelMode: google.maps.TravelMode.DRIVING,
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

  gotoLocation(location: google.maps.LatLng)
  {
    this.markerPositions = [location];
    this.map.panTo(location);
    this.zoom = 10;
    this.directionsResult$.next(undefined);
  }

}
