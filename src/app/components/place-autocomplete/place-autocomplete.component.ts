import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {GoogleMapsModule} from "@angular/google-maps";

export interface PlaceSearchResult {
  address: string;
  location?: google.maps.LatLng;
  imageUrl?: string;
  iconUrl?: string;
  name?: string;
}
@Component({
  selector: 'app-place-autocomplete',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, GoogleMapsModule],
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.css'
})
export class PlaceAutocompleteComponent implements AfterViewInit
{
  @ViewChild('inputField')
  inputField!: ElementRef;

  @Input()
  place: PlaceSearchResult | undefined;

  @Input()
  placeholder = 'enter address';

  @Output()
  placeChanged = new EventEmitter<PlaceSearchResult>();

  autocomplete: google.maps.places.Autocomplete | undefined;

  constructor(private ngZone: NgZone)
  {
  }

  ngAfterViewInit(): void
  {
    this.initAutocomplete();
  }

  initAutocomplete()
  {
    this.autocomplete = new google.maps.places.Autocomplete(this.inputField.nativeElement);
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete?.getPlace();

      const result: PlaceSearchResult = {
        address: this.inputField.nativeElement.value,
        name: place?.name,
        location: place?.geometry?.location,
        imageUrl: this.getPhotoUrl(place),
        iconUrl: place?.icon,
      };
      this.placeChanged.emit(result);
    });
  }

  getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined
  {
    return place?.photos && place?.photos.length > 0
      ? place?.photos[0].getUrl({ maxWidth: 500 })
      : undefined;
  }

  getValue(place: PlaceSearchResult | undefined)
  {
    return place ? place.address : null;
  }

  ngOnDestroy()
  {
    if (this.autocomplete)
    {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }
}
