import { Component } from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  currentUser: any;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.currentUser = this.storageService.getUser();
  }
}
