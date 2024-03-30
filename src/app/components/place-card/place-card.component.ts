import {Component, Input} from '@angular/core';
import {MatCard, MatCardHeader, MatCardImage, MatCardTitle} from "@angular/material/card";
import {PlaceSearchResult} from "../place-autocomplete/place-autocomplete.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardImage,
    NgIf
  ],
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.css'
})
export class PlaceCardComponent
{
  @Input() data: PlaceSearchResult | undefined;

  constructor() {}

  ngOnInit(): void {}
}
