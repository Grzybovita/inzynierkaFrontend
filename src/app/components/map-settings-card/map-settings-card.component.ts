import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MapService} from "../../services/map.service";
import {MatCard} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatInput} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {CalendarModule} from "primeng/calendar";

@Component({
  selector: 'app-map-settings-card',
  standalone: true,
  imports: [
    FormsModule,
    MatRadioGroup,
    MatRadioButton,
    MatCard,
    MatFormField,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatNativeDateModule,
    MatInput,
    CalendarModule,
  ],
  templateUrl: './map-settings-card.component.html',
  styleUrl: './map-settings-card.component.css'
})
export class MapSettingsCardComponent implements OnInit {

  @Output()
  selectedTravelModeChange = new EventEmitter<string>();

  @Output()
  selectedDepartureTimeChange = new EventEmitter<number>();

  selectedTravelMode: string = 'DRIVING';
  selectedDepartureTime: number | undefined = Date.now();
  date: Date | undefined;
  minDate: Date | undefined = new Date(Date.now());
  maxDate: Date | undefined;

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

    const savedDepartureTime = sessionStorage.getItem('selectedDepartureTime');
    if (savedDepartureTime)
    {
      this.selectedDepartureTime = JSON.parse(savedDepartureTime);
      if (this.selectedDepartureTime)
      {
        this.date = new Date(this.selectedDepartureTime)
      }
      else
      {
        this.date = new Date(Date.now());
      }
    }
    this.selectedDepartureTimeChange.emit(this.selectedDepartureTime);
  }

  onSelectedTravelModeChange()
  {
    this.selectedTravelModeChange.emit(this.selectedTravelMode);
  }

  onSelectedDepartureTimeChange()
  {
    this.selectedDepartureTime = this.date?.getTime();
    this.selectedDepartureTimeChange.emit(this.selectedDepartureTime);
  }

}
