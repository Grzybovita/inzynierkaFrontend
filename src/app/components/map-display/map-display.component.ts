import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {GoogleMap, MapDirectionsService} from "@angular/google-maps";
import {PlaceSearchResult} from "../place-autocomplete/place-autocomplete.component";
import {BehaviorSubject, map} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-map-display',
  templateUrl: './map-display.component.html',
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

  distanceMatrixService = new google.maps.DistanceMatrixService;

  constructor(private directionsService: MapDirectionsService,
              private http: HttpClient) {}

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
    const fromLocation = this.places[0]?.location;
    const toLocation = this.places[this.places.length - 1]?.location;
    const waypoints = this.places.slice(1, -1).map(place => place.location);

    if (fromLocation && toLocation && waypoints)
    {
      const addresses = this.places.map(place => place.address);

      const resultMatrix = this.getDistanceMatrix(addresses);
      const requestBody = JSON.stringify(resultMatrix);

        this.http.post('http://localhost:8080/optimizePath', requestBody, { headers: { 'Content-Type': 'application/json'} })
          .subscribe((response) => {
            console.log(response);
          });

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

  public getDistanceMatrix(addresses: string[]) : number[][]
  {
    const resultMatrix: number[][] = [];

    const request = {
      origins: addresses,
      destinations: addresses,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false,
    };
    this.distanceMatrixService.getDistanceMatrix(request).then((response) => {

      for (let i = 0; i < response.rows.length; i++)
      {
        resultMatrix[i] = [];
        for (let j = 0; j < response.rows.length; j++)
        {
          resultMatrix[i][j] = response.rows[i].elements[j].distance.value;
        }
      }
      console.log(resultMatrix);
      console.log(response);

    })
    return resultMatrix;
  }

}
