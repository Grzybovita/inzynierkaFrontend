import {Component} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {Subscription} from "rxjs";
import {MapDisplayComponent} from "../map-display/map-display.component";

@Component({
  selector: 'app-map-details-card',
  standalone: true,
    imports: [
        MatCard,
        MatRadioButton,
        MatRadioGroup
    ],
  templateUrl: './map-details-card.component.html',
  styleUrl: './map-details-card.component.css'
})
export class MapDetailsCardComponent {
  directionsResult: google.maps.DirectionsResult | undefined;
  private readonly directionsResultSubscription: Subscription;
  totalDistance: number = 0;
  totalTime: number = 0;
  startTime: string | undefined = '';

  constructor(private mapDisplayComponent: MapDisplayComponent)
  {
    this.directionsResultSubscription = this.mapDisplayComponent.directionsResult$.subscribe(
      result => {
        this.directionsResult = result;
        this.totalDistance = this.calculateTotalDistance(this.directionsResult);
        this.totalTime = this.calculateTotalTime(this.directionsResult);
        this.startTime = this.directionsResult?.request.drivingOptions?.departureTime.toLocaleTimeString();
      }
    );
  }

  ngOnDestroy()
  {
    if (this.directionsResultSubscription)
    {
      this.directionsResultSubscription.unsubscribe();
    }
  }

  private calculateTotalDistance(directionsResult: google.maps.DirectionsResult | undefined): number
  {
    if (!directionsResult)
    {
      return 0;
    }
    let result = 0;
    if (directionsResult && directionsResult.routes) {
      for (const route of directionsResult.routes) {
        if (route && route.legs) {
          for (const leg of route.legs) {
            if (leg && leg.distance && leg.distance.value) {
              result += leg.distance.value;
            }
          }
        }
      }
    }
    return result;
  }

  private calculateTotalTime(directionsResult: google.maps.DirectionsResult | undefined): number
  {
    if (!directionsResult)
    {
      return 0;
    }
    let result = 0;
    if (directionsResult && directionsResult.routes) {
      for (const route of directionsResult.routes) {
        if (route && route.legs) {
          for (const leg of route.legs) {
            if (leg && leg.duration && leg.duration.value) {
              result += leg.duration.value;
            }
          }
        }
      }
    }
    return result;
  }
}
