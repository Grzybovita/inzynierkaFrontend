import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MapService} from "../../services/map.service";

@Component({
  selector: 'app-map-settings-card',
  standalone: true,
  imports: [
    FormsModule,
    MatRadioGroup,
    MatRadioButton
  ],
  templateUrl: './map-settings-card.component.html',
  styleUrl: './map-settings-card.component.css'
})
export class MapSettingsCardComponent implements OnInit {

  selectedTravelMode: string = 'DRIVING';

  @Output()
  selectedTravelModeChange = new EventEmitter<string>();


  constructor(private mapService: MapService) {
  }

  ngOnInit(): void
  {
    const savedTravelMode = sessionStorage.getItem('selectedTravelMode');
    if (savedTravelMode)
    {
      this.selectedTravelMode = JSON.parse(savedTravelMode);
    }
    this.selectedTravelModeChange.emit(this.selectedTravelMode);
  }

  onSelectedVehicleChange()
  {
    this.selectedTravelModeChange.emit(this.selectedTravelMode);
  }

}
